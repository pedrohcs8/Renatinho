const { model, Schema } = require('mongoose')

module.exports = model(
  'TicketSetup',
  new Schema({
    guildId: String,
    channel: String,
    category: String,
    transcripts: String,
    handlers: String,
    everyone: String,
    description: String,
    buttons: [String],
  })
)
