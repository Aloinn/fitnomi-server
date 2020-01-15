// db.js
var mongoose = require('mongoose');
var mongoDB = 'mongodb://Aloin:DOGdays3@cluster0-shard-00-00-mwke2.mongodb.net:27017,cluster0-shard-00-01-mwke2.mongodb.net:27017,cluster0-shard-00-02-mwke2.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology:true})
