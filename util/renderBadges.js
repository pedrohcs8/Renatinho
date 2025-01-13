const { loadImage } = require('canvas')
const { image } = require('image-downloader')

module.exports = async (ctx, list, x, y) => {
  for (let i = 0; i < list.length; i++) {
    console.log(list[i])

    try {
      await loadImage(`./src/assets/img/png/profile_icons/${list[i]}.png`).then(
        (image) => {
          ctx.drawImage(image, x + 40 * i, y, 36, 36)
        }
      )
    } catch (e) {
      continue
    }
  }
}
