var express = require('express');
var fs = require('fs');
var fsExtra = require('fs-extra')
var cron = require('node-cron');
const { off } = require('process');
const config = require('config');
var serve = require('./serveImage');1
var count = 1;
var app = express();

// Defining port number
const PORT = config.has('Connection.server.port') ? config.get('Connection.server.port') : 5000;
const MINUTES = config.has('Generation.minutes') ? config.get('Generation.minutes') : 5;
const VERSIONS = getVersions();

console.log("cleanup tmp dir..")
fsExtra.emptyDirSync('./tmp')

setNewPictures(VERSIONS)

cron.schedule('*/'+MINUTES+' * * * *', () => {
    setNewPictures(VERSIONS)
    console.log('generating new picture in '+MINUTES+' minute(s)');
  });

app.use('/images', express.static('images'));
app.use(function (req, res, next) {
  res.redirect('images/image_'+VERSIONS[0].name+'.jpg');
});

var server = app.listen(PORT, () => {
    console.log(`Running server on PORT ${PORT}...`);
  })

function setNewPictures(VERSIONS){
  var library = '/mnt/library/';
  var allFiles = fs.readdirSync(library);
  let chosenFile = allFiles[Math.floor(Math.random() * allFiles.length)];
  VERSIONS.forEach(version=>{
    copyRandFile(library+chosenFile, version);
  })
}

function copyRandFile(input, version){
    var servingPath = './images/image_'+version.name+'.jpg';
    serve.generateImage(input, count, version, servingPath);
    count = count + 1;
}

function getVersions(){
  if(config.has('Versions')){
    let counter = 1;
    let configs = []
    while(config.has('Versions.v'+counter)){
      var version = createVersion(config.get('Versions.v'+counter+'.name'), config.get('Versions.v'+counter+'.height'), config.get('Versions.v'+counter+'.width'), config.get('Versions.v'+counter+'.offset'), config.get('Versions.v'+counter+'.shadow'));
      configs.push(version)
      counter++;
    }
    console.log("Applied configs. You have following configurations:")
    console.log("--------------------")
    configs.forEach(config =>{
      console.log("name: "+config.name)
      console.log("height: "+config.height)
      console.log("width: "+config.width)
      console.log("offset: "+config.offset)
      console.log("shadow: "+config.shadow)
      console.log("--------------------")
    })
    return configs;
  }else{
    console.error("please define at least one version")
    process.exit()
  }
}

function createVersion(name, height, width, offset, shadow){
  var ver = new Object;
  ver.name = name;
  ver.height = height;
  ver.width = width;
  ver.offset = offset;
  ver.shadow = shadow;
  return ver;
}