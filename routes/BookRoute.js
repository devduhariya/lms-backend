const mongoose = require('mongoose');
const Book = mongoose.model('book');
// const Date = require('/date');
module.exports = (app) => {
    const AuthMiddleware = async(req, res, next) => {
        // console.log('req.session: ', req.session);
        // added user key to req
        if (isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userEmail)) {
            res.status(401).send({ err: "Not logged in" });
            // console.log('Session', req.session);
        } else {
            next();
        }
    };
    const AdminAuthMiddleware = async(req, res, next) => {
        console.log('req.session:admin ', req.session);
        // added user key to req
        if (req.session.role === 'User') {
            res.status(401).send({ err: "unauthorized" });
            // console.log('Session', req.session);
        } else {
            next();
        }
    };

    app.get('/books', async(req, res) => {
        let books = await Book.find();
        // console.log==
        return res.status(200).send(books);
    });

    app.get('/book/:id', async(req, res) => {
        const id = req.params.id;
        let books = await Book.find({ categoryId: { $eq: id } });
        return res.status(200).send(books);
    });

    const isNullOrUndefined = (val) => val === null || val === undefined || val === '';
    app.post('/add/book', AdminAuthMiddleware, AuthMiddleware, async(req, res) => {
        const newBook = req.body;
        // console.log('newBook: ', newBook);
        if (isNullOrUndefined(newBook.title) && isNullOrUndefined(newBook.author) && isNullOrUndefined(newBook.totalBook) && isNullOrUndefined(newBook.bookDes) && isNullOrUndefined(newBook.bookImg) && isNullOrUndefined(newBook.categoryId)) {
            res.status(400).send({ message: 'data missing' });
        } else {
            const createNewBook = new Book(newBook);
            await createNewBook.save();
            res.status(201).send({ success: 'Book added successfully' });
        }
    });
    app.delete('/delete-book/:id', AdminAuthMiddleware, async(req, res) => {
        const id = req.params.id;
        const result = await Book.findById(id);
        if (result) {
            await Book.deleteOne({ _id: id });
            // console.log('_id some', id);
            res.status(200).send({ message: 'book deleted successfully' });
        } else {
            res.status(400).send({ message: "Book does not exists" })
        }
    });
    app.patch("/update-book/:id", AdminAuthMiddleware, async(req, res) => {
        const id = req.params.id;
        const newLms = req.body;
        // console.log("id",id);
        try {
            const existingLmsDocs = await Book.findById({ _id: id });
            // console.log('existingLmsDocs', existingLmsDocs);
            if (isNullOrUndefined((newLms.title) || (newLms.author) || (newLms.bookImg) || (newLms.bookDes) || (newLms.totalBook) || (newLms.issuedBook))) {
                res.status(400).send({ message: "Insufficient data" });
            } else {
                existingLmsDocs.title = newLms.title;
                existingLmsDocs.author = newLms.author;
                existingLmsDocs.bookImg = newLms.bookImg;
                existingLmsDocs.bookDes = newLms.bookDes;
                existingLmsDocs.totalBook = newLms.totalBook;
                existingLmsDocs.issuedBook = newLms.issuedBook;

                await existingLmsDocs.save();
                res.send(existingLmsDocs);
            }
        } catch (e) {
            console.log(e);
            res.status(400).send({ message: e.message });
        }
    });
}