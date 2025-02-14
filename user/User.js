// User.JS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;

var UserSchema = new Schema({
  username  : {
    type: String,
    unique: true,
    match: [/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, 'Please fill a valid '],
    required: true},
  email     : {
    type: String,
    unique: true,
    required: true},
  password  : {
    type: String,
    required: true},
  sets:[
    {type: ObjectId, ref: 'Set'}
  ],
  postnum: 0,
  followers:[
    {type: ObjectId, ref: 'User'}
  ],
  following:[
    {type: ObjectId, ref: 'User'}
  ]
})

// PROMISE GET DETAILS
UserSchema.statics.getPromise = (params) =>{
  return new Promise((resolve, reject)=>{
    User.findOne(params,(err,user)=>{
      if(err) {reject(err)}
    })
    .populate('sets', 'image')
    .exec((err,user)=>{resolve(user)})
  })
}

// FIND BY USERNAME METHOD
UserSchema.statics.findByUsername = (username, callback) =>
{return User.findOne({username: username} , callback)}

// FIND BY EMAIL METHOD
UserSchema.statics.findByEmail = (email, callback) =>
{return User.findOne({email: email}, callback)}

var User = mongoose.model('User', UserSchema);
module.exports = User
