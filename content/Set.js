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
  user: {type: ObjectId, ref: 'Image'},
  images: [
    {type: ObjectId, ref: 'Image'}
  ],
  image: String,
  created_on: Date,
})

// PROMISE GET SET
SetSchema.statics.getSet = (set_id) =>
{return Set.findOne({_id:ObjectId(set_id)}).lean(true).exec()}

// PROMISE CREATE
SetSchema.statics.createPromise = (params) =>{
  return new Promise((resolve, reject)=>{
    Set.create(params,(err,set)=>{
      if(err) {reject(err)}
      else    {resolve(set)}
    })
  })
}

// FIND BY EMAIL METHOD
var Set = mongoose.model('Set', SetSchema);
module.exports = Set
