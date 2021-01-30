const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const { Schema } = mongoose;
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role:String
    //  userId:ObjectID
});
mongoose.model('user', userSchema);