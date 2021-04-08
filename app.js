require('dotenv').config();
const express = require('express')
const app = express();
const port = 8080;
const bodyParser = require("body-parser");

const homeRoute = require('./routes/home');
const createNft = require('./routes/create-mosaic');
const addMetadata = require('./routes/add-metadata');
const uploadToIpfs = require('./routes/upload');
const transferNft = require('./routes/transfer-mosaic');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', homeRoute);
app.use('/create-mosaic', createNft);
app.use('/upload', uploadToIpfs)
app.use('/add-metadata', addMetadata);
app.use('/transfer-mosaic', transferNft);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
