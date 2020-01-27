const express = require('express');
const router = express.Router();
const Auth = require('../auth/Auth')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../user/User')
const Image = require('../content/Image');
const Set = require('../content/Set');


// GET FEED
router.get('/feed/', (req,res)=>{
  (async ()=>{
    sets = await Set.find({}).sort({created_on: 1})
    .populate('images')
    res.status(200).send(sets)
  })()
});

// GET FULL SET
router.get('/get_set/:set_id', (req,res)=>{
  (async ()=>{
    if(!ObjectId.isValid(req.params.set_id)){
      return res.status(400).send("No items exist!")
    } else {
    const set = await Set.getPromise({_id: ObjectId(req.params.set_id)})
    if(!set){return res.status(404).send("No items exist!")}
    res.status(200).send(set)
    }
  })()
})

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
router.get('/get_file/:user_id/:set_num/:image_num', (req,res)=>{
  console.log('t')
  let location = req.params.user_id+'/'+req.params.set_num+'/'+req.params.image_num
  Upload.retrieveFile(location)
    .then((file)=>{
        res.writeHead(200, {'Content-Type': 'image/jpeg'})
        res.write(file, 'binary');
        res.end(null, 'binary');
      })
    .catch((err)=>{res.status(500).send(err)})
});

router.post('/', Auth.verify, (req, res)=>{
  (async () =>{
    try{
      // USER ID
      const id = req.body.id;

      // GETS NUMBER OF POSTS FROM USER
      const user = await new Promise((resolve, reject)=>{
        User.findById({_id: ObjectId(id)}, (err, user)=>{
          if(err) {reject(err)}
          else    {resolve(user)}
        })
      })
      user.postnum += 1;
      const post_num = user.postnum;

      // ASYNC UPLOADS FILES AND DATA ONE AT A TIME
      let entries = null;
      const data = await new Promise((resolve, reject)=>{
          uploadFiles(req, res, (err)=>{
          let names=[], descs=[], pics=[];
          entries = Object.keys(req.body).length/2;

          for(var i = 0; i<entries; i++){
            names[i] = req.body[i.toString()+"name"]
            descs[i] = req.body[i.toString()+"desc"]
            pics[i] = req.files[i.toString()+'pic'][0].path
          }

          if(err) {reject(err)}
          else    {resolve({names:names, descs:descs, pics:pics})}
        })
      })

      // CREATE MAIN SET
      const folder = id +"/"+ post_num;
      let location = folder +'/'+ 0
      Upload.uploadFile(data['pics'][0], location)
      const set = await Set.createPromise({
        name: data['names'][0],
        desc: data['descs'][0],
        image: location,
        images: [],
        user: ObjectId(id),
        created_on: Date.now(),
      })

      // ASYNC UPLOAD FILES
      let uploadPromises = [];
      let objectPromises = [];
      for(var i = 1; i<entries; i++){
        location = folder +'/'+ i.toString()
        let _p1 = Upload.uploadFile(data['pics'][i], location)
        let _p2 = Image.createPromise({
          name    : data['names'][i],
          desc    : data['descs'][i],
          location: location,
          set     : ObjectId(set._id)
        })
        uploadPromises.push(_p1);
        objectPromises.push(_p2);
      }
      await Promise.all(uploadPromises)
      const images = await Promise.all(objectPromises)
      set.images = images;

      // SAVING AND UPDATING DATABASE
      set.save((err)=>{})
      user.sets.push(ObjectId(set._id))
      user.save((err=>{}));
      res.status(200).send()

    } catch(err){console.log(err)}
  })()
})

module.exports = router;
