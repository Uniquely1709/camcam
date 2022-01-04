const sharp = require("sharp");

async function compositeImages(underlaying, top, position, output) {
  try {
    await sharp(underlaying)
      .composite([
        {
          input: top,
          top: 0,
          left: position,
        },
      ])
      .toFile(output);
  } catch (error) {
    console.log(error);
  }
}
module.exports.compositeImages = compositeImages;