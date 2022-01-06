const sharp = require("sharp");

async function resizeImageHeight(input, output, offset) {
  try {
    await sharp(input)
      .resize({
        height: (1080 - (2 * offset))
      })
      .toFile(output);
  } catch (error) {
    console.log(error);
  }
}

module.exports.resizeImageHeight = resizeImageHeight;