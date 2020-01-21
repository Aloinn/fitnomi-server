const express = require('express');
const router = express.Router();
const Auth = require('../auth/Auth')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../user/User')
const Image = require('../content/Image');
const Set = require('../content/Set');

// File uploading middleware
const multer = require('multer')
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb)=>{
    cb(null, file.originalname)
  }
})

const uploadFiles = multer({ storage: storage }).fields([
  {name:'0pic', maxCount:1},
  {name:'1pic', maxCount:1},
  {name:'2pic', maxCount:1},
  {name:'3pic', maxCount:1},
  {name:'4pic', maxCount:1},
  {name:'5pic', maxCount:1},
  {name:'6pic', maxCount:1},
  {name:'7pic', maxCount:1},
  {name:'8pic', maxCount:1},
])

// Upload functions
const Upload = require('./Upload')

// ROUTES
router.get('/get_file/:file_set/:file_name', (req,res)=>{

  let location = req.params.file_set+'/'+req.params.file_name
  console.log(res.getHeaders())

  Upload.retrieveFile(location)
    .then((file)=>{
      res.writeHead(200, {'Content-Type': 'image/jpeg'})
        res.write(file, 'binary');
        res.end(null, 'binary');
      })
    .catch((err)=>{res.status(500).send(err)})
    /*
  Upload.retrieveFile(location, res, ()=>{
    console.log(res)
    //res.render('image_resp',{title:'test'})
  });*/
});

// TEST TEST TEST TEST TEST ES TESTEST ESS TEST ESE
router.get('/get_set/:set_id', (req,res)=>{
  res.render('test',{})
})



router.post('/post', Auth.verify, (req, res)=>{
  var num = 0;
  let id = req.body.id
  // MAKES UNIQUE ID BASED ON HOW MANY POSTS USER HAS
  User.findById({_id: ObjectId(id)}, (err, user)=>{
    console.log(user)
    num = user.sets.length.postnum;
    user.sets.length.postnum += 1;
  })
  // FOLDER IS EQUAL TO USER ID + COLLECTION POST #
  let folder = id+num;

  // GET FILES FROM FORM
  uploadFiles(req, res, (err)=>{

    const entries = Object.keys(req.body).length/2
    for(var i = 0; i<entries; i++){
      if(i==0){

      }else{

      }
    }
    /*
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

    res.status(200).send("Good!")*/
  })

})


module.exports = router
