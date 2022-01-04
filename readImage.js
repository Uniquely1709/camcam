const sharp = require('sharp');

async function getMetadata(path) {
    try {
        const metadata = await sharp(path).metadata();
        return metadata;
    } catch (error){
        console.log(`An error occurred during processing: ${error}`);
    }

  }

module.exports.getMetadata = getMetadata;