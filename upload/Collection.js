// User.JS
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
  name:{
    type: String,
    maxlength: 20,
    required: true,},
  desc:{
    type: String,
    maxlength: 400,
    required: true},
  user: String,
  images: [String],
  }
})

// FIND BY EMAIL METHOD
var Collection = mongoose.model('User', CollectionSchema);
module.exports = Collection
