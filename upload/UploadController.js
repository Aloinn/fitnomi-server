const express = require('express');
const router = express.Router();
const Auth = require('../auth/Auth')
const User = require('../user/User')
const ObjectId = require('mongoose').Types.ObjectId;

// File uploading middleware
const multer = require('multer')
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb)=>{
    cb(null, file.originalname)
  }
})
//const _upload = multer({ storage: storage }).single('file1')
/*
const _upload = multer({ storage: storage }).fields([
  {name: 'head', maxCount:1},
  {name: '1pic', maxCount:1},
  {name: '2pic', maxCount:1},
  {name: '3pic', maxCount:1},
  {name: '4pic', maxCount:1},
  {name: '5pic', maxCount:1},
  {name: '6pic', maxCount:1},
  {name: '7pic', maxCount:1},

])*/
const uploadFiles = multer({ storage: storage }).array('images')

const Upload = require('./Upload')

// ROUTES
router.get('/get_file/:file_name',(req,res)=>{
  Upload.retrieveFile(req.params.file_name, res);
});

router.post('/post', Auth.verify, (req, res)=>{
  var pics = []
  var errs = []
  var num = 0;
  // MAKES UNIQUE ID BASED ON HOW MANY POSTS USER HAS
  User.findById({_id: ObjectId(req.body.id)}, (err, user)=>{
    num = user.collections.length.postnum;
    user.collections.length.postnum += 1;
  })
  // FOLDER IS EQUAL TO USER ID + COLLECTION POST #
  var folder = req.body.id+num;

  // GET FILES FROM FORM
  uploadFiles(req, res, (err)=>{
    if(err){return res.status(500).send()}

    // FOR EACH FILE POST IN UNIQUE AREA
    for(var i=0; i<req.files.length; i++){
      response = Upload.uploadFile(req.files[i].path, folder+'/'+i.toString(), res);
      console.log(response)
    }
  })

})


module.exports = router
