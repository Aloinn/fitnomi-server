const express = require('express');
const router = express.Router();

// File uploading middleware
const multer = require('multer')
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb)=>{
    cb(null, file.originalname)
  }
})
const _upload = multer({ storage: storage });

const Upload = require('./Upload')

// ROUTES
router.get('/get_file/:file_name',(req,res)=>{
  Upload.retrieveFile(req.params.file_name, res);
});

router.post('/post', _upload.single('image'), (req, res)=>{
  response = Upload.uploadFile(req.file.path, req.file.filename, res);
})


module.exports = router
