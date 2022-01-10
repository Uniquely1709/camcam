const sharp = require("sharp");

async function compositeImages(format, underlaying, top, position, output, offset) {
  try {
    if(format == "width"){
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
    }else{
      console.log(position)
      await sharp(underlaying)
      .composite([
        {
          input: top,
          top: position,
          left: offset,
        },
      ])
      .sharpen()
      .toFile(output);
    }

  } catch (error) {
    console.log(error);
  }
}
module.exports.compositeImages = compositeImages;