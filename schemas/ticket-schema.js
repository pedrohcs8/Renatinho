const { model, Schema } = require('mongoose')

module.exports = model(
  'Tickets',
  new Schema({
    guildId: String,
    membersId: [String],
    ticketId: String,
    channelId: String,
    closed: Boolean,
    locked: Boolean,
    type: String,
    claimed: Boolean,
    claimedBy: String,
  })
)
