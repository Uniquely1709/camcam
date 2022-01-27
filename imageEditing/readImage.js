const sharp = require('sharp');

async function getMetadata(path) {
    const metadata = await sharp(path).metadata();
    return metadata;
  }

module.exports.getMetadata = getMetadata;