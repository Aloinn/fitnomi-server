// app.js
var express = require('express');
var db = require('./db');
var app = express();
var cors = require("cors");

app.use(express.static('public'));
app.use(cors());

app.set('view engine', 'ejs');

var UserController = require('./user/UserController');
var AuthController = require('./auth/AuthController');
var ContentController = require('./content/ContentController');
app.use('/users', UserController);
app.use('/auth',  AuthController);
app.use('/content', ContentController);

// TEST AREA
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.post('/test', (req, res)=>{
  console.log(req.body)
})
app.get('/test', (req,res)=>{
  console.log('test');
  res.status(200).send();
})
// END TEST AREA

module.exports = app;
