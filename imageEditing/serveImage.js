var meta = require('./readImage');
var height = require('./resizeImageHeight');
var width = require('./resizeImageWidth');
var crop = require('./cropImage');
var comp = require('./compositeImages');
var shadow = require('./boxShadow');
var glob = require('glob')
var fs = require('fs');

let baseData; 

function generateImage(path, int, version, output, aspect, length){
    console.log("generating picture with offset "+version.offset+" based of "+path+ " + aspect "+aspect)
    const pre = './tmp/image'+(int-(3*length))+"-"+version.offset+"*";
    if(int>1){
        try {
            glob(pre, function (er, files) {
                for (const file of files) {
                    fs.unlinkSync(file)
               }
            })
        } catch(err) {
            console.error(err)
        }
    }
    const tmp = './tmp/image'+int+"-"+version.offset;
    meta.getMetadata(path).then(x => {
        baseData = x; 
        if(((Math.round((x.width / x.height)*100))/100)<=aspect){
            height.resizeImageHeight(path, tmp+"-resized-height.jpg", version.offset, version.height, parseInt(0, 10))
            width.resizeImageWidth(path, tmp+"-resized-width.jpg", parseInt(0, 10), version.width, parseInt(20, 10)).then(x =>{
                meta.getMetadata(tmp+"-resized-width.jpg").then(x => {
                    crop.cropImage(tmp+"-resized-width.jpg", tmp+"-resized-width-cropped.jpg", Math.round(x.height / 2 -520), parseInt(0, 10), version.height, version.width).then(x => {
                        meta.getMetadata(tmp+"-resized-height.jpg").then(y => {
                            let widthData = y;
                            if(version.shadow==false){
                                comp.compositeImages("width", tmp+"-resized-width-cropped.jpg", tmp+"-resized-height.jpg", Math.round(version.width / 2 - widthData.width / 2), output, parseInt(version.offset, 10)).then(x =>{
                                }).catch(console.error)
                            }else{
                                shadow.boxShadow(tmp+"-resized-height.jpg", tmp+"-resized-width-cropped.jpg", version.height, version.width, output).then(x=>{
                                }).catch(console.error)
                            }
                        }).catch(console.error)
                    }).catch(console.error)
                }).catch(console.error)     
            }).catch(console.error)
        }else{
            width.resizeImageWidth(path, tmp+"-resized-width.jpg", version.offset, version.width, parseInt(0, 10))
            height.resizeImageHeight(path, tmp+"-resized-height.jpg",0, version.height, parseInt(20, 10)).then(x =>{
                meta.getMetadata(tmp+"-resized-height.jpg").then(x =>{
                    crop.cropImage(tmp+"-resized-height.jpg", tmp+"-resized-height-cropped.jpg", parseInt(0, 10), Math.round(x.width / 2 -520), version.height, version.width).then(x => {
                        meta.getMetadata(tmp+"-resized-width.jpg").then(y => {
                            let heightData = y;
                            if(version.shadow==false){
                                comp.compositeImages("height", tmp+"-resized-height-cropped.jpg", tmp+"-resized-width.jpg", Math.round((version.height - heightData.height)/2), output, parseInt(version.offset, 10)).then(x =>{
                                }).catch(console.error)
                            }else{
                                shadow.boxShadow(tmp+"-resized-width.jpg", tmp+"-resized-height-cropped.jpg", version.height, version.width, output).then(x=>{
                                }).catch(console.error)
                            }
                        }).catch(console.error)
                    }).catch(console.error)
                }).catch(console.error)
            }).catch(console.error)
        }
    }).catch(error => {
        console.error(error);
    })
}

module.exports.generateImage = generateImage;