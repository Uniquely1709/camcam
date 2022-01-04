const sharp = require("sharp");

async function resizeImageWidth(input, output) {
  try {
    await sharp(input)
      .resize({
        width: 1920
      })
      .blur(20)
      .toFile(output);
  } catch (error) {
    console.log(error);
  }
}
module.exports.resizeImageWidth = resizeImageWidth;