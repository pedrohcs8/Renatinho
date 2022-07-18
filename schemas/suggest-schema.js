const { model, Schema } = require('mongoose')

module.exports = model(
  'Suggestions',
  new Schema({
    guildId: String,
    messageId: String,
    details: Array,
  })
)
