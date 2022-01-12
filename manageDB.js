var mysql = require('mysql');
const config = require('config');
const fs = require('fs');
const res = require('express/lib/response');
const { set } = require('express/lib/response');
const { create } = require('domain');
const { Verify } = require('crypto');

function setup(con, VERSIONS, LIBRARY, cb){

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("create table if not exists images (image_id INT(11) not null auto_increment, image VARCHAR(255), folder VARCHAR(255), rating INT, constraint images_pk primary key (image_id))", function (err, result) {
        if (err) throw err;
        VERSIONS.forEach(version => {
          fs.readdir(LIBRARY+version.folder, (err, files) => {
            files.forEach(file => {
              var req = "select * from images where image = '"+file+"'"
              con.query(req, function(err, result, fields){
                if(result.length === 0){
                  con.query("insert into images (image, folder, rating) values ('"+file+"', '"+version.folder+"', 0)", function (err, result) {
                    if (err) throw err;
                  });
                }
              })
            });
          });
         ;
        }) 
        console.log("Table for pictures populated")   
      });
    createVersions(con, VERSIONS)
    cb();  
  });

}

function createVersions(con, versions){
  con.query("create table if not exists versions (version_id INT(11) not null auto_increment, name VARCHAR(255), folder VARCHAR(255), height INT, width INT, offset INT, image INT(11), deleted BOOLEAN, constraint versions_pk primary key (version_id))", function (err, result) {
    if (err) throw err;
    con.query("update versions set deleted = true ", function(err, result){
      versions.forEach(version =>{
        con.query("select * from versions where name = '"+version.name+"'", function(err, result, fields){
          if(result.length === 0){
            con.query("insert into versions (name, folder, height, width, offset, deleted) VALUES ('"+version.name+"', '"+version.folder+"', "+version.height+", "+version.width+", "+version.offset+", false )", function(err, result){
            })
          }else{
            con.query("update versions set folder = '"+version.folder+"', height = "+version.height+", width = "+version.width+", offset = "+version.offset+", deleted = false where name = '"+version.name+"'", function(err, result){

            })
          }
        })
      })
    })
    console.log("Table for versions populated")
  });

}

module.exports.setup = setup;
module.exports.createVersions = createVersions;