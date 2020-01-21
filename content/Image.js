// User.JS
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;

const ImageSchema = new Schema({
  name:{
    type: String,
    maxlength: 26,
    required: true,},
  desc:{
    type: String,
    maxlength: 26},
  location:{type: String},
  set:{type: ObjectId, ref: 'Set'},
})

// PROMISE CREATE
ImageSchema.statics.createPromise = (params) =>{
  return new Promise((resolve, reject)=>{
    Image.create(params,(err,image)=>{
      if(err) {reject(err)}
      else    {resolve(image)}
    })
  })
}

// FIND BY EMAIL METHOD
var Image = mongoose.model('Image', ImageSchema);
module.exports = Image;
