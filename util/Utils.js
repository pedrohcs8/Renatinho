const abbrev = require('@util/abbrev.js')
const convertAbbrev = require('@util/convertAbbrev')
const renderBadges = require('@util/renderBadges')

module.exports = class Util {
  static toAbbrev(num) {
    return abbrev(num)
  }

  static renderBadges(ctx, msg, x, y) {
    return renderBadges(ctx, msg, x, y)
  }

  static notAbbrev(num) {
    return convertAbbrev(num)
  }
}
