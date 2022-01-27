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
var glob = require('glob')
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
const SAVE = config.has('Generation.save') ? config.get('Generation.save') : false;
const GENERATED = config.has('GeneratedLibrary') ? config.get('GeneratedLibrary') : 'nopath';
const LIBRARY = config.has('BaseLibrary') ? config.get('BaseLibrary') : 'nopath';

try {
  glob('./images/*', function (er, files) {
      for (const file of files) {
          fs.unlinkSync(file)
     }
  })
} catch(err) {
  console.error(err)
}

const VERSIONS = getVersions();

app.use('/images', express.static('images'));
app.use(function (req, res, next) {
  res.redirect('images/image_'+VERSIONS[0].name+'.jpg');
});

var server = app.listen(PORT, () => {
  console.log(`Running server on PORT ${PORT}...`);
})

function setNewPictures(VERSIONS, con){
  con.query("select distinct folder from versions where deleted = false", function(err, results){
    if(results.length > 0){
      generateNewImageIDs(results, VERSIONS, generateNewImages)

    }else{
      console.log("no versions indexed yet")
    }
  })
}

function generateNewImageIDs(results, VERSIONS, _cb){
  results.forEach(result =>{
    con.query("select image_id from images where folder = '"+result.folder+"' order by rand() limit 1", function(err, rs){
      if (rs.length >= 1){
      con.query("update versions set image = "+rs[0].image_id+" where folder = '"+result.folder+"'", res =>{
      })
    }
    })
  })
  _cb(VERSIONS);
}

function generateNewImages(VERSIONS){
  VERSIONS.forEach(version=>{
    con.query("select image.folder, image.image, versions.version_id, image.image_id from images as image, versions as versions where image.image_id = versions.image and versions.name = '"+version.name+"'", function (err, result) {
      if (err) throw err;
      if (result.length > 0){
        con.query("select generated from generations where version_id = "+result[0].version_id+" and image_id = "+result[0].image_id, function(err, gen){ 
          var url = GENERATED+"versionID-"+result[0].version_id+"/"+result[0].image_id+".jpg"
          if(gen.length > 0 && gen[0].generated == true){
              console.log("using generated version for "+result[0].version_id+"/"+result[0].image_id)
              fs.copyFile(url, './images/image_'+version.name+'.jpg', (err)=>{
                if (err)
                  console.log(err)
              })
          }else{
              var output = './images/image_'+version.name+'.jpg'
              if(SAVE){
                var path = url; 
              }else{
                var path = output;
              }
              copyRandFile(LIBRARY+result[0].folder+'/'+result[0].image, version, (Math.round((version.width / version.height)*100))/100, VERSIONS, path, output, result[0].image_id, result[0].version_id);
          }
        })
      }else{
        console.log("nothing indexed yet")
      }
    });
})
}

function copyRandFile(input, version, aspect, VERSIONS, path, output, image_id, version_id){
    serve.generateImage(input, count, version, path, aspect, VERSIONS.length, SAVE, output, image_id, version_id, con);
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
  db.setup(con, VERSIONS, LIBRARY, SAVE, GENERATED, start)
}

function start(){
  scheudle(con)
}

startup()

function scheudle(con){
  cron.schedule('*/'+MINUTES+' * * * *', () => {
    setNewPictures(VERSIONS, con)
    console.log('generating new picture in '+MINUTES+' minute(s)');
  });
}
