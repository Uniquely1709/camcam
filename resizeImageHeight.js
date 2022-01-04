const sharp = require("sharp");

async function resizeImageHeight(input, output) {
  try {
    await sharp(input)
      .resize({
        height: 1080
      })
      .toFile(output);
  } catch (error) {
    console.log(error);
  }
}

module.exports.resizeImageHeight = resizeImageHeight;