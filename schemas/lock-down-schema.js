const { model, Schema } = require('mongoose')

module.exports = model(
  'lockdown',
  new Schema({
    guildId: String,
    channelId: String,
    time: String,
  })
)
