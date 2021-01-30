const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const {Schema} = mongoose;
const AdminBookSchema = new Schema({
    title:String,
    author:String,
    bookDes:String,
    bookImg:String,
    totalBook:Number,
    issuedBook:Number,
   BookId:ObjectID
});
mongoose.model('adminBook', AdminBookSchema);