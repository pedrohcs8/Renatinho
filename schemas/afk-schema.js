const { model, Schema } = require('mongoose')

module.exports = model(
  'afk',
  new Schema({
    guildId: String,
    userId: String,
    status: String,
    time: String,
  })
)
