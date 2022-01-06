const sharp = require("sharp");

async function resizeImageWidth(input, output, width) {
  try {
    await sharp(input)
      .resize({
        width: width
      })
      .blur(20)
      .toFile(output);
  } catch (error) {
    console.log(error);
  }
}
module.exports.resizeImageWidth = resizeImageWidth;