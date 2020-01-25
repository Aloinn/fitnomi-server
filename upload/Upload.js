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

// ASYNC PROMISE FUNCTIONS
function readFileAsync(filename){
  return new Promise((resolve, reject)=>{
    fs.readFile(filename, (err, data)=>{
      if(err) {reject(err)}
      else    {resolve(data)}
    })
  })
}

function uploadFileAsync(params){
  return new Promise((resolve, reject)=>{
    s3.putObject(params, (err, data)=>{
      if(err) {reject(err)}
      else    {resolve()}
    })
  })
}

function getFileAsync(params){
  return new Promise((resolve, reject)=>{
    s3.getObject(params, (err,data)=>{
      if(err) {reject(err)}
      else    {resolve(data.Body)}
    })
  })
}

// RETURNS A PROMISE FOR FILE UPLOAD
async function uploadFile(file_path, target_name){
  let error = null
  try{
    const file_data = await readFileAsync(file_path);
    await uploadFileAsync({
      Bucket: config.bucket_name,
      Key:    target_name,
      Body:   file_data
    })
  }catch(err){error = null}

   return new Promise((resolve, reject)=>{
     if(error)  {reject(error)}
     else       {resolve()}
  })
}

// RETURNS A PROMISE FOR FILE TRIEVAL
async function retrieveFile(file_name){
  let error = null
  let file = null
  try{
    file = await getFileAsync({
      Bucket: config.bucket_name,
      Key:    file_name
    })
  }catch(err){error=err}

  return new Promise((resolve, reject)=>{
    if(error) {reject(error)}
    else      {resolve(file)}
  })
}


module.exports.uploadFile = uploadFile
module.exports.retrieveFile = retrieveFile
