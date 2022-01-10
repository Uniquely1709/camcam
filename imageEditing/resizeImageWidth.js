const sharp = require("sharp");

async function resizeImageWidth(input, output, offset, width, blur) {
  try {
    if(blur == 0){
      await sharp(input)
      .resize({
        width: width - 2 * offset
      })
      .toFile(output);
    }else{
      await sharp(input)
      .resize({
        width: width - 2 * offset
      })
      .blur(blur)
      .toFile(output);
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports.resizeImageWidth = resizeImageWidth;