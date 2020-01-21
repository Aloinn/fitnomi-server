const express = require('express');
const router = express.Router();
const Auth = require('../auth/Auth')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../user/User')
const Image = require('../content/Image');
const Set = require('../content/Set');

// ROUTES
router.get('/get_file/:file_set/:file_name', (req,res)=>{
  let location = req.params.file_set+'/'+req.params.file_name
  /*Upload.retrieveFile(location, res, ()=>{
    console.log(res)
    //res.render('image_resp',{title:'test'})
  });*/
});

// GET FULL SET
router.get('/get_set/:set_id', (req,res)=>{
  Set.getSet(req.params.set_id)
    .then(_set => console.log('ys', _set))
    .catch(err => console.log('no', err))
  res.send(200)

})

module.exports = router;
