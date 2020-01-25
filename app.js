// app.js
var express = require('express');
var db = require('./db');
var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

var UserController = require('./user/UserController');
var AuthController = require('./auth/AuthController');
var ContentController = require('./content/ContentController');
app.use('/users', UserController);
app.use('/auth',  AuthController);
app.use('/content', ContentController);
module.exports = app;
