const sharp = require("sharp");

async function compositeImages(underlaying, top, position, output, offset) {
  try {
    await sharp(underlaying)
      .composite([
        {
          input: top,
          top: offset,
          left: position,
        },
      ])
      .sharpen()
      .toFile(output);
  } catch (error) {
    console.log(error);
  }
}
module.exports.compositeImages = compositeImages;