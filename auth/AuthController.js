const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))

const Crypto = require('crypto')
const User = require('../user/User')
const config = require('../auth/config.js')

router.post('/login', (req, res)=>{
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
    } else {
      // USER NOT AUTHENTICATED
      return res.status(401).send({auth: false, token: null})
    }
  })
})

router.get('/me', (req, res)=>{
  var token = req.headers['x-access-token'];
  if(!token){return res.status(401).send({auth:false, message:'Not logged in'})}
  jwt.verify(token, config.secret, (err, decoded)=>{
    if(err){return res.status(500).send({auth: false, message:'Failed to authenticate'})};
    console.log(decoded.id)
    User.findById({_id: ObjectId(decoded.id)}, (err, user)=>{
      console.log(err, user)
      if(err||!user){return res.status(404).send({auth:false, message:'Error!'})}
      res.status(200).send(user);
    })
  })
})

module.exports = router;
