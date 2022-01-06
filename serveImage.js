var meta = require('./readImage');
var height = require('./resizeImageHeight');
var width = require('./resizeImageWidth');
var crop = require('./cropImage');
var comp = require('./compositeImages');
var shadow = require('./boxShadow');
var fs = require('fs');
var output_height = 1080;
var output_width = 1920;

let baseData; 

function generateImage(path, int, version, output){
    console.log("generating picture with offset "+version.offset+" based of "+path)
    const pre = './tmp/image'+(int-1);
    if(!pre===0){
        try {
            fs.unlinkSync(pre+"-resized-height.jpg")
            fs.unlinkSync(pre+"-resized-width.jpg")
            fs.unlinkSync(pre+"-resized-width-cropped.jpg")
        } catch(err) {
            console.error(err)
        }
    }
    const tmp = './tmp/image'+int+version.offset;
    meta.getMetadata(path).then(x => {
        baseData = x; 
        height.resizeImageHeight(path, tmp+"-resized-height.jpg", version.offset, version.height)
        width.resizeImageWidth(path, tmp+"-resized-width.jpg", version.width).then(x =>{
            meta.getMetadata(tmp+"-resized-width.jpg").then(x => {
                crop.cropImage(tmp+"-resized-width.jpg", tmp+"-resized-width-cropped.jpg", Math.round(x.height / 2 -520), version.height, version.width).then(x => {
                    meta.getMetadata(tmp+"-resized-height.jpg").then(y => {
                        let widthData = y;
                        if(version.shadow==false){
                            comp.compositeImages(tmp+"-resized-width-cropped.jpg", tmp+"-resized-height.jpg", Math.round(version.width / 2 - widthData.width / 2), output, parseInt(version.offset, 10)).then(x =>{
                            }).catch(console.error)
                        }else{
                            shadow.boxShadow(tmp+"-resized-height.jpg", tmp+"-resized-width-cropped.jpg", version.height, version.width, output).then(x=>{
                            }).catch(console.error)
                        }
                    }).catch(console.error)
                }).catch(console.error)
            }).catch(console.error)     
        }).catch(console.error)
    }).catch(error => {
        console.error(error);
    })
}

module.exports.generateImage = generateImage;