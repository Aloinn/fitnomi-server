var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const Crypto = require('crypto')
const Auth = require('../auth/Auth')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
var User = require('./User')

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function validatePhone(phone) {
    var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone));
}
router.post('/', function(req, res){
  console.log('Requesting post');
  console.log(req.body)

  let salt = Crypto.randomBytes(16).toString('base64')
  let hash = Crypto.createHmac('sha512',salt).update(req.body.password).digest("base64");
  let password = salt + "$" + hash;
  req.body.password = password;

  if(!validatePhone(req.body.phone))
  {return res.status(400).send("Invalid phone number!")}

  if(!validateEmail(req.body.email))
  {return res.status(400).send("Invalid email address!")}
/*
  User.create({
    username  : req.body.username,
    email     : req.body.email,
    phone     : req.body.phone,
    password  : req.body.password,
    sets      : [],
    postnum   : 0,
    followers : [],
    following : [],
  },
  function(err, user){
    if(err){return res.status(500).send("There was a problem with request!")}
    res.status(200).send(user);
  });*/
});

router.get('/', function(req, res){
  console.log('Requesting get');
  User.find({}, function(err, users){
    if(err){return res.status(500).send("There was a problem finding the users!")}
    res.status(200).send(users);
  })
})

router.get('/:username', function(req, res){
  (async ()=>{
    const user = await User.getPromise({username: req.params.username})
    if(!user){return res.status(404).send("No users exist!")}
    res.status(200).send(user)
  })()
})

module.exports = router;
