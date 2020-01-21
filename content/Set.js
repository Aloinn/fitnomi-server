// User.JS
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;

const SetSchema = new Schema({
  name:{
    type: String,
    maxlength: 20,
    required: true,},
  desc:{
    type: String,
    maxlength: 400,
    required: true},
  user: String,
  images: [
    {type: ObjectId, ref: 'Image'}
  ],
  image: String,
  created_on: Date,
})

// PROMISE GET SET
SetSchema.statics.getSet = (set_id) =>
{return Set.findOne({_id:ObjectId(set_id)}).lean(true).exec()}

// FIND BY EMAIL METHOD
var Set = mongoose.model('Set', SetSchema);
module.exports = Set
