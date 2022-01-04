const sharp = require("sharp");

async function cropImage(input, output, crop) {
  try {
    await sharp(input)
      .extract({ width: 1920, height: 1080, left: 0, top: crop  })
      .toFile(output);
  } catch (error) {
    console.log(error);
  }
}
module.exports.cropImage = cropImage;