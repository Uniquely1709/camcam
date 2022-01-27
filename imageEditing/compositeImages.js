const sharp = require("sharp");

async function compositeImages(format, underlaying, top, position, output, offset) {
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
}
module.exports.compositeImages = compositeImages;