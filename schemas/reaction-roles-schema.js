const { model, Schema } = require('mongoose')

let reaction = new Schema({
  guildId: String,
  message: String,
  emoji: String,
  role: String,
})

module.exports = model('reaction-roles', reaction)
