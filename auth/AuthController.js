const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))

const Crypto = require('crypto')
const User = require('../user/User')
const Auth = require('./Auth')


router.post('/login', Auth.login, (req, res)=>{
  res.status(200).send({
    auth: req.body.auth,
    token: req.body.token,
  })
})

router.get('/me', Auth.verify, (req, res)=>{
  res.status(200).send({
    id: req.body.id
  })
})

module.exports = router;
