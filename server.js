var express = require('express');
var fs = require('fs');
var cron = require('node-cron');
var serve = require('./serveImage');
var count = 1;
var app = express();

// Defining port number
const PORT = process.env.PORT || 5000;
const MINUTES = process.env.MINUTES || 5;
const OFFSET = process.env.OFFSET || 0;


copyRandFile();
cron.schedule('*/'+MINUTES+' * * * *', () => {
    copyRandFile();
    console.log('generating new picture in '+MINUTES+' minute(s)');
  });

app.use('/images', express.static('images'));
app.use(function (req, res, next) {
  res.redirect('images/image.jpg');
});

var server = app.listen(PORT, () => {
    console.log(`Running server on PORT ${PORT}...`);
  })

function copyRandFile(){
    var servingPath = './images/image.jpg';
    var library = '/mnt/library/';
    var allFiles = fs.readdirSync(library);
    let chosenFile = allFiles[Math.floor(Math.random() * allFiles.length)];
    console.log(chosenFile);
    serve.generateImage(library+chosenFile, count, OFFSET);
    count = count + 1;
}