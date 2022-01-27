const sharp = require("sharp");

async function cropImage(input, output, top, left, height, width) {
  await sharp(input)
    .extract({ width: width, height: height, left: left, top: top  })
    .toFile(output);
}
module.exports.cropImage = cropImage;