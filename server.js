var express = require('express');
var fs = require('fs');
var cron = require('node-cron');
var serve = require('./serveImage');
var count = 1;

copyRandFile();
cron.schedule('*/1 * * * *', () => {
    copyRandFile();
    console.log('running a task in 1 minutes');
  });

var app = express();


// Defining port number
const PORT = 5000;    

//setting middleware
// app.use(express.static('public')); //Serves resources from public folder

app.use('/images', express.static('images'));


var server = app.listen(PORT, () => {
    console.log(`Running server on PORT ${PORT}...`);
  })


function copyRandFile(){
    var servingPath = './images/image.jpg';
    var library = '/mnt/library/';
    var allFiles = fs.readdirSync(library);
    let chosenFile = allFiles[Math.floor(Math.random() * allFiles.length)];
    console.log(chosenFile);
    serve.generateImage(library+chosenFile, count);
    count = count + 1;
    // fs.copyFile(library+chosenFile, servingPath, (err) => {
    //     if (err) {
    //       console.log("Error Found:", err);
    //     }
    //     else {
    //       console.log("File Contents of copied_file:");
    //     }
    //   });
}