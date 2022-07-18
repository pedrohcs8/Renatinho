const abbrev = require('@util/abbrev.js')
const convertAbbrev = require('@util/convertAbbrev')
const renderEmoji = require('@util/renderEmoji')

module.exports = class Util {
  static toAbbrev(num) {
    return abbrev(num)
  }

  static renderEmoji(ctx, msg, x, y) {
    return renderEmoji(ctx, msg, x, y)
  }

  static notAbbrev(num) {
    return convertAbbrev(num)
  }
}
