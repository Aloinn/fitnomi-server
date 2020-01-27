const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../user/User');
const Crypto = require('crypto');
const config = require('../config.js')

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function validatePhone(phone) {
    var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone));
}

login = (req, res, next)=>{
  key = ''
  if(validateEmail(req.body.login_id)){key='email'}
  else if(validatePhone(req.body.login_id)){key='phone'}
  else {key="username"}
  if(req.body.password==null){req.body.password = req.body.login_password}

  User.findOne({[key]: req.body.login_id}, (err, user)=>{
    if(err){return res.status(500).send('Server error')}
    if(!user){return res.status(404).send('No users exist with credentials')}

    // Getting old password
    let passwordFields = user.password.split('$');
    let salt = passwordFields[0];
    let old_hash = passwordFields[1];

    let new_hash = Crypto.createHmac('sha512',salt).update(req.body.password).digest("base64");

    /// CHECKING PASSWORDS
    if(new_hash===old_hash){

      // USER AUTHENTICATED!
      var token = jwt.sign({id:user._id}, config.secret, {});
      req.body.auth = true;
      req.body.token = token;
      next();
    } else {
      // USER NOT AUTHENTICATED
      return res.status(401).send('Invalid password!')
    }
  })
}

verify = (req, res, next)=>{
  var token = req.headers['x-access-token'];
  if(!token){return res.status(401).send({auth:false, message:'Not logged in'})}
  jwt.verify(token, config.secret, (err, decoded)=>{
    if(err){return res.status(500).send({auth: false, message:'Failed to authenticate'})};
    User.findById({_id: ObjectId(decoded.id)}, (err, user)=>{
      if(err||!user){return res.status(404).send({auth:false, message:'Error!'})}
      req.body = { id: user._id};
      next()
    })
  })
}

module.exports.login = login;
module.exports.verify = verify;
