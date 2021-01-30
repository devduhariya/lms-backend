const mongoose = require('mongoose');
const Category = mongoose.model('category');

module.exports = (app) => {
    const AuthMiddleware = async(req, res, next) => {
        console.log('req.session: ', req.session);
        if (isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userEmail)) {
            res.status(401).send({ err: "Not logged in" });
        } else {
            next();
        }
    };
    const AdminAuthMiddleware = (req, res, next) => {
        console.log('req.session:admin auth: ', req.session);
        // added user key to req
        if (req.session.role === 'User') {
            res.status(401).send({ err: "unauthorized" });
            console.log('Session gjhhjfgcv', req.session);
        } else {
            next();
        }
    };
    app.get('/categories-list', async(req, res) => {
        let categories = await Category.find();
        return res.status(200).send(categories);
    });

    const isNullOrUndefined = (val) => val === null || val === undefined || val === '';
    app.post('/categories', AdminAuthMiddleware, AuthMiddleware, async(req, res) => {
        const newCategory = req.body;
        if (isNullOrUndefined(newCategory.categoryName || newCategory.categoryDes || newCategory.categoryImg)) {
            res.status(400).send({ message: 'data missing' });
        } else {
            const cretaeNewCategory = new Category(newCategory);
            await cretaeNewCategory.save();
            res.send(cretaeNewCategory);
        }
    });
    app.patch("/update-category/:id", AdminAuthMiddleware, AuthMiddleware, async(req, res) => {
        const id = req.params.id;
        const newLms = req.body;
        // console.log("id",id);
        try {
            const existingLmsDocs = await Category.findById({ _id: id });
            // console.log('existingLmsDocs', existingLmsDocs);
            if (isNullOrUndefined(newLms.categoryName) && isNullOrUndefined(newLms.categoryDes) && isNullOrUndefined(newLms.categoryImg)) {
                res.status(400).send({ message: "Insufficient data" });
            } else {
                existingLmsDocs.categoryName = newLms.categoryName;
                existingLmsDocs.categoryDes = newLms.categoryDes;
                existingLmsDocs.categoryImg = newLms.categoryImg;

                await existingLmsDocs.save();
                res.send(existingLmsDocs);
            }
        } catch (e) {
            console.log(e);
            res.status(400).send({ message: e.message });
        }
    });
    app.delete('/delete-category/:id', AdminAuthMiddleware, AuthMiddleware, async(req, res) => {
        const id = req.params.id;
        // console.log("cat",id);
        const result = await Category.findOne({ _id: id });
        // console.log("resiult:",result);
        if (result) {
            await Category.deleteOne({ _id: id });
            res.status(200).send({ message: 'category deleted' });
        } else {
            res.status(400).send({ err: 'category does not exists.' });
        }
    });
}