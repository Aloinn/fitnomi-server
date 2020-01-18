// app.js
var express = require('express');
var db = require('./db');
var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

var UserController = require('./user/UserController');
var AuthController = require('./auth/AuthController');
var UploadController = require('./upload/UploadController')
app.use('/users', UserController);
app.use('/auth',  AuthController);
app.use('/upload', UploadController);
module.exports = app;
