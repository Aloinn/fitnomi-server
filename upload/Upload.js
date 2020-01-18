const AWS = require('aws-sdk');
const fs = require('fs');
const config = require('../config')

// SETTING CREDENTIALS FOR STORAGE

AWS.config.update({
  accessKeyId: config.iam_access_id,
  secretAccessKey: config.iam_secret,
  region: config.iam_region
})
const s3 = new AWS.S3();

// UPLOADING FILES

uploadFile = (source, targetName, res)=>{
  fs.readFile(source, (err, filedata)=>{
    if(!err){
      const putParams = {
        Bucket: config.bucket_name,
        Key: targetName,
        Body: filedata
      }
      s3.putObject(putParams, (err, data)=>{
        if(err){return res.status(500).send({success:false, err: err});} else {
          fs.unlink(source, (err)=>{});
          return res.status(200).send({success:true, url:data.ETag})// RETURN SUCCESS
        }
      })
    } else {return res.status(400).send({success:false, err: err});}
  });
}

retrieveFile = (filename, res)=>{
  const getParams = {
    Bucket: config.bucket_name,
    Key: filename
  }
  s3.getObject(getParams, (err, data)=>{
    if(err){return res.status(400).send({success:false, err:err})}
    else{
      return res.send(data.Body);
    }
  })
}
module.exports.uploadFile = uploadFile
module.exports.retrieveFile = retrieveFile
