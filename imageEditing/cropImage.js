const sharp = require("sharp");

async function cropImage(input, output, top, left, height, width) {
  try {
    await sharp(input)
      .extract({ width: width, height: height, left: left, top: top  })
      .toFile(output);
  } catch (error) {
    console.log(error);
  }
}
module.exports.cropImage = cropImage;