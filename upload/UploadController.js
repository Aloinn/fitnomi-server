const express = require('express');
const router = express.Router();
const Auth = require('../auth/Auth')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../user/User')
const Image = require('../content/Image');
const Set = require('../content/Set');
/*
const bodyParser = require('body-parser')
const formData = require('express-form-data')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(formData.parse())
*/
// File uploading middleware
const multer = require('multer')
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb)=>{
    cb(null, file.originalname)
  }
})
const uploadFiles = multer({ storage: storage }).fields('images')

// Upload functions
const Upload = require('./Upload')

// ROUTES
router.get('/get_file/:file_name',(req,res)=>{
  Upload.retrieveFile(req.params.file_name, res);
});
router.post('/test',(req,res)=>{console.log(req.body)})

router.post('/post', Auth.verify, (req, res)=>{
  var num = 0;
  let id = req.body.id
  // MAKES UNIQUE ID BASED ON HOW MANY POSTS USER HAS
  User.findById({_id: ObjectId(id)}, (err, user)=>{
    num = user.sets.length.postnum;
    user.sets.length.postnum += 1;
  })
  // FOLDER IS EQUAL TO USER ID + COLLECTION POST #
  let folder = id+num;

  // GET FILES FROM FORM
  uploadFiles(req, res, (err)=>{
    // Take descriptions
    let names = req.body.names;
    let descs = req.body.descs;

    if(err){return res.status(500).send()}
    var set_id = null;

    // CREATES A THUMBNAIL
    let thumbnail = req.files.pop(0)
    var location = folder+'/thumbnail'
    Upload.uploadFile(thumbnail.path, location, res);
    Set.create({
      name: names.pop(0),
      desc: descs.pop(0),
      image: location,
      images: [],
      user: ObjectId(id),
    }, (err, set)=>{
      // IF SET SUCCESSFULLY CREATED, CREATE IMAGES
      set_id = set._id;
      for(var i=0; i<req.files.length; i++){
        location = folder+'/'+i.toString();
        Upload.uploadFile(req.files[i].path, location, res);
        Image.create({
          name      : names[i],
          desc      : descs[i],
          location  : location,
          set       : ObjectId(set_id),
        },(err,image)=>{set.images.push(ObjectId(image._id))})
      }
    })
    // FOR EACH FILE POST IN UNIQUE AREA

    res.status(200).send("Good!")
  })

})


module.exports = router
