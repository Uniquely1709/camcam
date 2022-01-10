var express = require('express');
var fs = require('fs');
var fsExtra = require('fs-extra')
var cron = require('node-cron');
const { off } = require('process');
const config = require('config');
var serve = require('./imageEditing/serveImage');
var db = require('./manageDB');
var count = 1;
var app = express();
var mysql = require('mysql');
const res = require('express/lib/response');


var con = mysql.createConnection({
  host: config.get('Connection.db.hostname'),
  user: config.get('Connection.db.user'),
  password: config.get('Connection.db.password'),
  database: config.get('Connection.db.database')
});

console.log('Environment: '+process.env.NODE_ENV);

const PORT = config.has('Connection.server.port') ? config.get('Connection.server.port') : 5000;
const MINUTES = config.has('Generation.minutes') ? config.get('Generation.minutes') : 5;
const LIBRARY = config.has('BaseLibrary') ? config.get('BaseLibrary') : 'nopath';
const VERSIONS = getVersions();

app.use('/images', express.static('images'));
app.use(function (req, res, next) {
  res.redirect('images/image_'+VERSIONS[0].name+'.jpg');
});

var server = app.listen(PORT, () => {
  console.log(`Running server on PORT ${PORT}...`);
})

function setNewPictures(VERSIONS, con){
  con.query("select distinct folder from versions", function(err, results){
    if(results.length > 0){
      results.forEach(result =>{
        con.query("select image_id from images where folder = '"+result.folder+"' order by rand() limit 1", function(err, rs){
          con.query("update versions set image = "+rs[0].image_id+" where folder = '"+result.folder+"'", res =>{
            VERSIONS.forEach(version=>{
              con.query("select image.folder, image.image from images as image, versions as versions where image.image_id = versions.image and versions.name = '"+version.name+"'", function (err, result) {
                if (err) throw err;
                if (result.length > 0){
                  oldFolder = version.folder;
                  oldImage = result[0].image;
                  console.log(LIBRARY+result[0].folder+'/'+result[0].image)
                  copyRandFile(LIBRARY+result[0].folder+'/'+result[0].image, version, (Math.round((version.width / version.height)*100))/100, VERSIONS);
                }else{
                  console.log("nothing indexed yet")
                }
              });
          })
          })
        })
      })
    }else{
      console.log("no versions indexed yet")
    }
  })
}

function copyRandFile(input, version, aspect, VERSIONS){
    var servingPath = './images/image_'+version.name+'.jpg';
    console.log(count)
    serve.generateImage(input, count, version, servingPath, aspect, VERSIONS.length);
    count = count + 1;
}

function getVersions(){
  if(config.has('Versions')){
    let counter = 1;
    let configs = []
    while(config.has('Versions.v'+counter)){
      var version = createVersion(config.get('Versions.v'+counter+'.name'), config.get('Versions.v'+counter+'.height'), config.get('Versions.v'+counter+'.width'), config.get('Versions.v'+counter+'.offset'), config.get('Versions.v'+counter+'.shadow'), config.get('Versions.v'+counter+'.folder'));
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
      console.log("folder: "+config.folder)
      console.log("--------------------")
    })
    return configs;
  }else{
    console.error("please define at least one version")
    process.exit()
  }
}

function createVersion(name, height, width, offset, shadow, folder){
  var ver = new Object;
  ver.name = name;
  ver.height = height;
  ver.width = width;
  ver.offset = offset;
  ver.shadow = shadow;
  ver.folder = folder; 
  return ver;
}

function startup(){
  console.log("cleanup tmp dir..")
  fsExtra.emptyDirSync('./tmp')
  console.log('generating new picture in '+MINUTES+' minute(s)');
  db.setup(con, VERSIONS, LIBRARY, start)
}

function start(){
  setNewPictures(VERSIONS, con)
  scheudle(con)


}

startup()

function scheudle(con){
  cron.schedule('*/'+MINUTES+' * * * *', () => {
    setNewPictures(VERSIONS, con)
    console.log('generating new picture in '+MINUTES+' minute(s)');
  });
}
