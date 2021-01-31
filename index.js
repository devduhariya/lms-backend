//  index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const session = require("express-session");
const session_secret = "ssshhh";
var path = require("path");
// IMPORT MODELS
require('./models/Category');
require('./models/User');
require('./models/Book');
require('./models/Cart');
// require('./models/AdminBooks');
const app = express();
const port = process.env.PORT || 8000;
app.use(cors({
  credentials: true,
  origin: "https://still-chamber-88289.herokuapp.com"
}));
app.set('trust proxy', 1);
app.use(
  session({
    secret: session_secret,
    cookie: { maxAge: 1 * 60 * 60 * 1000, sameSite:'none',secure:true },
    resave: true,
    saveUninitialized:false
  })
);
app.use(express.static(path.join(__dirname, 'build')));
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || `mongodb+srv://sukhdev:123@lmsb.imlwf.mongodb.net/lmsb?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

//IMPORT ROUTES
require('./routes/CategoryRoute')(app);
// IMPORT Book
require('./routes/BookRoute')(app);
require('./routes/CartRoute')(app);
// IMPORT User
require('./routes/UserRoute')(app);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`app running on port ${port}`)
});