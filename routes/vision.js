const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
AWS.config.region = "ap-southeast-1";
AWS.config.accessKeyId = "AKIARAR74F5B2ZJFROOU";
AWS.config.secretAccessKey = "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";
const fs = require('fs');
const path = require('path')

const client = new AWS.Rekognition();
router.post('/classify', async function (req, res, next) {
  var fileName = req.files.file.name;
  var newpath = path.join(__dirname, "../public/images/" + fileName)
  await req.files.file.mv(newpath, function (err) {
    if (err) {
      console.log(err, 'er2');
    }
    else {
      console.log("File uploaded");
      const contents = Buffer.from(fs.readFileSync(newpath), 'base64');
      const params = {
        Image: {
          Bytes: contents
        },
        "MaxLabels": 10,
        "MinConfidence": 75
      }

      let res1 = [];

      // Your code starts here //
      client.detectLabels(params, function (err, response) {
        if (err) {
          console.log(err, err.stack); // if an error occurred
        } else {
          response.Labels.forEach(label => {
            res1.push(label.Name);

          })
          res.json({
            "labels": res1
          });
        }
      });
    }
  })


});

module.exports = router;
