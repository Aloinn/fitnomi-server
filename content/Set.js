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
  user: {type: ObjectId, ref: 'User'},
  images: [
    {type: ObjectId, ref: 'Image'}
  ],
  image: String,
  created_on: Date,
})

// PROMISE GET DETAILS
SetSchema.statics.getPromise = (params) =>{
  return new Promise((resolve, reject)=>{
    Set.findOne(params,(err,set)=>{
      if(err) {reject(err)}
    })
    .populate('user', 'username')
    .populate('images')
    .exec((err,set)=>{resolve(set)})
  })
}

// PROMISE GET SET
SetSchema.statics.getThumbnailPromise = (params) =>{
  return new Promise((resolve, reject)=>{
    Set.findOne(params,(err,set)=>{
      if(err) {reject(err)}
    })
    .select('image')
    .populate('images', 'location')
    .exec((err,set)=>{resolve(set)})
  })
}

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
