const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    categoryName: String,
    categoryDes: String,
    categoryImg: String
});
mongoose.model('category', categorySchema);