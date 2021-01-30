const mongoose = require('mongoose');
const adminBook = mongoose.model('adminBook');
// const Date = require('/date');
module.exports = (app) => {
    const AdminAuthMiddleware = async (req, res, next) => {
        console.log('req.session:admin ', req.session);
        // added user key to req
        if (req.session.role === 'User' && req.session.role === '')  {
            res.status(401).send({ err: "unauthorized" });
            // console.log('Session', req.session);
        } else {
            next();
        }
    };
    const isNullOrUndefined = (val) => val === null || val === undefined || val === '';
  const AuthMiddleware = async (req, res, next) => {
    if (isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userEmail)) {
      res.status(401).send({ err: "Not logged in" });
    } else {
      next();
    }
  };
    
    app.get('/admin/get/books',AdminAuthMiddleware, async (req, res) => {
        let Abooks = await adminBook.find();
        return res.status(200).send(Abooks);
    });
    app.get('/admin/book/:id',AdminAuthMiddleware, async (req, res) => {
        const id = req.params.id;
        let Abooks = await adminBook.find({bookId:{$eq:id}});
        return res.status(200).send(Abooks);
    });
    const isNullOrUndefined = (val) => val === null || val === undefined;
    app.post('/add/book',AdminAuthMiddleware,AuthMiddleware, async (req, res) => {
        const newBook = req.body;
        console.log('newBook',newBook);
        if (isNullOrUndefined(newBook.title && newBook.author && newBook.totalBook && newBook.bookDes && newBook.bookImg)) {
            res.status(400).send({ message: 'data missing' });
            console.log('Book',newBook);
        } else {
            const createAdminNewBook = new adminBook(newBook);
            await createAdminNewBook.save();
            res.status(201).send({ success: 'Book added successfully' });
        }
    });
    app.delete('/delete-book/:id',AdminAuthMiddleware, async (req, res) => {
        const id = req.params.id;
        const result = await adminBook.findById(id);
        if (result) {
            await adminBook.deleteOne({ _id: id });
            res.status(200).send({ message: 'book deleted successfully' });
        } else {
            res.status(400).send({ message: "Book does not exists" })
        }
    });
    app.patch("/admin/update-book/:id",AdminAuthMiddleware, async (req, res) => {
        const id = req.params.id;
        const newLms = req.body;
        // console.log("id",id);
        try {
            const existingLmsDocs = await adminBook.findById({_id:id});
            console.log('existingLmsDocs', existingLmsDocs);
            if (isNullOrUndefined((newLms.title) && (newLms.author) && (newLms.bookImg) && (newLms.bookDes) &&(newLms.totalBook) && (newLms.issuedBook))) {
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