var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
var User = require('./User')

router.post('/', function(req, res){
  console.log('Requesting post');
  console.log(req.body)

  User.create({
    username  : req.body.username,
    email     : req.body.email,
    password  : req.body.password
  },
  function(err, user){
    if(err){return res.status(500).send("There was a problem with request!")}
    res.status(200).send(user);
  });
});

router.get('/', function(req, res){
  console.log('Requesting get');
  User.find({}, function(err, users){
    if(err){return res.status(500).send("There was a problem finding the users!")}
    res.status(200).send(users);
  })
})

module.exports = router;
