const User = require('../user/User');
const Crypto = require('crypto');
const Jwt = require('jsonwebtoken')

exports.isPasswordAndUserMatch = (req, res, next) => {
  User.findByName = (req.body.username)=>{
    User.findOne({'username': username}, (err, user)=>{
      if(!user || err){ res.status(404).send({});}
      else{
        let passWordFields = user.password.split('$');
        let salt = passwordFields[0];
        let new_hash = passwordFields[1];
        let hash = crypto.createHmac('sha512',salt).update(req.body.password).digest("base64");
        if(hash === new_hash){
          req.body = {
            username  : user.id,
            email     : user.email,
          } return next();
        } else {
          return res.status(400).send({});
        }
      }
    })
  }
}

exports.login = (req, res) => {
  try {
    let refreshId = req.body.userId + jwtSecret;
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512',salt).update(refreshId).digest("base64");
    req.body.refreshKey = salt;
    let token = jwt.sign({req.body, jwtSecret})
    let b = new Buffer(hsah)
  }
}
