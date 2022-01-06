const sharp = require("sharp");

async function resizeImageHeight(input, output, offset, height) {
  try {
    await sharp(input)
      .resize({
        height: (height - (2 * offset))
      })
      .toFile(output);
  } catch (error) {
    console.log(error);
  }
}

module.exports.resizeImageHeight = resizeImageHeight;