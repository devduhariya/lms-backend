const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const {Schema} = mongoose;
const bookSchema = new Schema({
    title:String,
    author:String,
    bookDes:String,
    bookImg:String,
    totalBook:Number,
    issuedBook:Number,
    issueDate:{ type : Date, default: Date.now },
    submissionDate:{ type : Date, default: Date.now },
    duration:Number,
    categoryId:ObjectID
});
mongoose.model('book', bookSchema);