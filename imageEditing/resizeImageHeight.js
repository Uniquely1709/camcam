const sharp = require("sharp");

async function resizeImageHeight(input, output, offset, height, blur) {
  try {
    if(blur == 0){
      await sharp(input)
      .resize({
        height: (height - (2 * offset))
      })
      .toFile(output);
    }else{
      await sharp(input)
      .resize({
        height: (height - (2 * offset))
      })
      .blur(blur)
      .toFile(output);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports.resizeImageHeight = resizeImageHeight;