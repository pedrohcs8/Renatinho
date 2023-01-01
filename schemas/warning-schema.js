const { Schema, model } = require('mongoose')

module.exports = model(
  'WarningDB',
  new Schema({
    guildId: String,
    userId: String,
    userTag: String,
    content: Array,
  }),
)
