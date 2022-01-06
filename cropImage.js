const sharp = require("sharp");

async function cropImage(input, output, crop, height, width) {
  try {
    await sharp(input)
      .extract({ width: width, height: height, left: 0, top: crop  })
      .toFile(output);
  } catch (error) {
    console.log(error);
  }
}
module.exports.cropImage = cropImage;