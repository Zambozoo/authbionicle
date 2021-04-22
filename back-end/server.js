const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// connect to the database
mongoose.connect('mongodb://localhost:27017/mongobionicle', {
  useNewUrlParser: true
});



// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '/var/www/mongobionicle.parkernel.com/images/',
  limits: {
    fileSize: 10000000
  }
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

//Schema for Product
const productSchema = new mongoose.Schema({
  desc: String,
  price: String,
  count: Number
});
const Product = new mongoose.model('product', productSchema, 'product');

//Schema for comments
const commentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'product'
  },
  name: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  },
});
const Comment = new mongoose.model('comment',commentSchema,'comment');

// Create a scheme for imgs: a title and a path to an image.
const photoSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'product'
  },
  title: String,
  path: String
});
const Photo = mongoose.model('photo', photoSchema,'photo');

app.get('/api/product/:productID', async (req, res) => {
    try {
        let product = await Product.findOne({_id: req.params.productID});
        if (!product) {
            res.send(404);
            return;
        };
        res.send(product);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/api/comment/:productID',validUser, async (req, res) => {
  try {
    const comment = new Comment({
      name: req.user.username,
      body: req.body.formData.body,
      product: req.params.productID,
    });
    console.log(comment + ":" + req.body.formData.name + ":" + req.body.formData.body);
    await comment.save();
    res.send(comment);
  } catch(error) {
    console.log(error);
   res.send(500);
  }
});

app.post('/api/comment/edit/:commentID', validUser, async (req, res) => {
  try {
    const comment = {
      _id: req.params.commentID,
      name: req.user.username,
      body: req.body.formData.body,
      product: req.body.formData.productID,
    };
    const cur = Comment.findOne({_id:req.params.commentID});
    await Comment.replaceOne({_id:req.params.commentID},comment);
    res.send(comment);
  } catch(error) {
    console.log(error);
   res.send(500);
  }
});

app.post('/api/comment/remove/:commentID', validUser, async (req, res) => {
  try {
    await Comment.remove({_id:req.params.commentID, name: req.user.username});
    res.send(200);
  } catch(error) {
    console.log(error);
   res.send(500);
  }
});

app.get('/api/comments/:productID', async (req, res) => {
  try  {
    let comments = await Comment.find({product:req.params.productID});
    res.send(comments);
  } catch(error) {
    console.log(error);
   res.send(500);
  }
});

app.get('/api/products', async (req, res) => {
  try {
    let products = await Product.find();
    res.send(products);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/photo/:photoID', async (req, res) => {
  try {
    let photo = await Photo.findOne({_id:req.params.photoID});
    if(!photo) {
      res.send(404);
      return;
    }
    res.send(photo);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/photos/:productID', async (req, res) => {
  try {
    let product = await Product.findOne({_id: req.params.productID});
    console.log(product);
    let photos = await Photo.find({product:product._id});
    console.log(photos.length);

    res.send(photos);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// import the users module and setup its API path
app.use("/api/users", users.routes);

app.listen(3003, () => console.log('Server listening on port 3003!'));
