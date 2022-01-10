const { outputFile } = require("fs-extra");
const sharp = require("sharp");

const SHADOW_MARGIN = 40
const SHADOW_BLUR = 10
const SHADOW_OFFSET = 10
const SHADOW_OPACITY = 1

async function boxShadow(main, background, vheight, vwidth, output) {
  try {
    const stream = await sharp(main)
    const { width, height } = await stream.metadata()
    const shadow = await sharp(
        Buffer.from(`
          <svg
            width="${width + SHADOW_MARGIN * 2}"
            height="${height + SHADOW_MARGIN * 2}"
          >
            <rect
              width="${width}"
              height="${height}"
              x="${SHADOW_MARGIN}"
              y="${SHADOW_MARGIN + SHADOW_OFFSET}"
              style="fill:rgba(0, 0, 0, ${SHADOW_OPACITY});stroke-width:8;stroke:rgb(0,0,0)"
            />
          </svg>`)
      )
        .blur(SHADOW_BLUR)
        .toBuffer()
    const image = await stream
        .resize({
            vheight,
            vwidth,
        })
        .toBuffer()
    await sharp(background)
            .composite([
              { input: shadow, blend: 'multiply' },
              { input: image, blend: 'over' },
            ])
            .toFile(output)

  }catch (error) {
    console.log(error);
  }
}

module.exports.boxShadow = boxShadow;