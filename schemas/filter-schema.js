const { model, Schema } = require('mongoose')

module.exports = model(
  'fitro',
  new Schema({
    guildId: String,
    log: String,
    words: [String],
  })
)
