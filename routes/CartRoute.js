const mongoose = require('mongoose');
const Cart = mongoose.model('cart');
const Book = mongoose.model('book');
const Category = mongoose.model('category');

module.exports = (app) => {
    const isNullOrUndefined = (val) => val === null || val === undefined;
    const AuthMiddleware = async(req, res, next) => {
        console.log('req.session: in save book:', req.session);
        // added user key to req
        if (isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userEmail)) {
            res.status(401).send({ err: "Not logged in" });
            // console.log('Session', req.session);
        } else {
            next();
        }
    };
    app.post('/add-to-cart', AuthMiddleware, async(req, res) => {
        console.log('in book/cart ...', res);
        const newCart = req.body;
        console.log('newCart: ', newCart);
        newCart.addedDate = new Date();
        newCart.userId = req.session.userEmail;
        newCart.status = 'Pending';
        console.log('newCart', newCart);
        if (isNullOrUndefined(newCart.categoryId || newCart.bookId)) {
            res.status(400).send({ message: 'not added' });
        } else {
            const bookExists = await Cart.find({
                bookId: { $eq: newCart.bookId },
                userId: { $eq: newCart.userId }
            });
            console.log('bookExists: ', bookExists);
            if (bookExists && bookExists.length === 0) {
                const createNewcart = new Cart(newCart);
                await createNewcart.save();
                res.status(200).send({ success: 'Book added In cart' });

            } else {
                res.status(200).send({ message: "Book already exixts" });

            }
        }
    });
    app.get('/cart', AuthMiddleware, async(req, res) => {
        const email = req.session.userEmail;
        console.log('email from session: ', email);
        let cart = await Cart.find({
            userId: { $eq: email }
        });
        console.log('cart: ', cart);
        let finalResult = {
            userId: cart[0].userId,
            items: []
        };
        if (cart && cart.length > 0) {
            for (const item of cart) {
                console.log('item: ', item);
                const book_id = item.bookId;
                const category_id = item.categoryId;
                const book = await Book.findById({ _id: book_id });
                if (!book) {
                    // res.status(400).send()
                    continue;
                }
                console.log('book: ', book);
                const category = await Category.findById({ _id: category_id });
                if (!category) {
                    // res.status(400).send()
                    continue;
                }
                finalResult.items.push({
                    book: book,
                    category: category.categoryName,
                    addedDate: item.addedDate,
                });
            }
            return res.status(200).send(finalResult);
        } else {
            res.status(400).send();
        }
    });
}