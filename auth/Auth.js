const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../user/User');
const Crypto = require('crypto');
const config = require('../config.js')

login = (req, res, next)=>{
  User.findOne({email: req.body.email}, (err, user)=>{
    if(err){return res.status(500).send('Server error')}
    if(!user){return res.status(404).send('Unable to login')}

    // Getting old password
    let passwordFields = user.password.split('$');
    let salt = passwordFields[0];
    let old_hash = passwordFields[1];

    let new_hash = Crypto.createHmac('sha512',salt).update(req.body.password).digest("base64");

    /// CHECKING PASSWORDS
    if(new_hash===old_hash){

      // USER AUTHENTICATED!
      var token = jwt.sign({id:user._id}, config.secret, {});
      res.status(200).send({auth:true, token: token})
      req.body.auth = true;
      req.body.token = token;
      next();
    } else {
      // USER NOT AUTHENTICATED
      return res.status(401).send({auth: false, token: null})
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
      req.body.id = user._id;
      next();
    })
  })
}

module.exports.login = login;
module.exports.verify = verify;
