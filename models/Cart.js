const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const {Schema} = mongoose;
const cartSchema = new Schema({
    categoryId:ObjectID,
    userId:String,
    bookId:ObjectID,
    addedDate:{ type : Date, default: Date.now },
    status:String,
    // submissonDate:{ type : Date, default: Date.now },
});
mongoose.model('cart', cartSchema);