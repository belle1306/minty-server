const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const multer = require('multer');
const upload = multer({ dest: '/uploads'});

const pinfileUrl = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;


router.post('/', upload.single('avatar'), function (req, res) {

  let data = new FormData();
  const file = req.file.path;
  data.append('file', fs.createReadStream(file));
  
  //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
  //metadata is optional
  const metadata = JSON.stringify({
    name: 'testname',
    keyvalues: {
      exampleKey: 'exampleValue'
    }
  });
  data.append('pinataMetadata', metadata);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: 'FRA1',
          desiredReplicationCount: 1
        },
        {
          id: 'NYC1',
          desiredReplicationCount: 2
        }
      ]
    }
  });
  data.append('pinataOptions', pinataOptions);

  axios
    .post(pinfileUrl, data, {
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY
      }
    })
    .then(function (response) {
      //handle response here
      console.log(response.data);
      res.status(200).send(response.data);
    })
    .catch(function (error) {
      //handle error here
      console.log(error);
      res.status(500).send(error);
    });


});

module.exports = router;
