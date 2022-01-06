var express = require('express');
var fs = require('fs');
var fsExtra = require('fs-extra')
var cron = require('node-cron');
const { off } = require('process');
var serve = require('./serveImage');
var count = 1;
var app = express();

// Defining port number
const PORT = process.env.PORT || 5000;
const MINUTES = process.env.MINUTES || 5;
const OFFSETS = process.env.OFFSET.split(',') || [0];
console.log("Defined offsets: "+OFFSETS)

console.log("cleanup tmp dir..")
fsExtra.emptyDirSync('./tmp')

setNewPictures(OFFSETS)

cron.schedule('*/'+MINUTES+' * * * *', () => {
    setNewPictures(OFFSETS)
    console.log('generating new picture in '+MINUTES+' minute(s)');
  });

app.use('/images', express.static('images'));
app.use(function (req, res, next) {
  res.redirect('images/image.jpg');
});

var server = app.listen(PORT, () => {
    console.log(`Running server on PORT ${PORT}...`);
  })

function setNewPictures(OFFSETS){
  var library = '/mnt/library/';
  var allFiles = fs.readdirSync(library);
  let chosenFile = allFiles[Math.floor(Math.random() * allFiles.length)];
  OFFSETS.forEach(offset=>{
    copyRandFile(library+chosenFile, offset);
  })
}

function copyRandFile(input, offset){
    if(offset==0){
      var servingPath = './images/image.jpg';
    }else{
      var servingPath = './images/image_o'+offset+'.jpg';
    }   
    serve.generateImage(input, count, offset, servingPath);
    count = count + 1;
}