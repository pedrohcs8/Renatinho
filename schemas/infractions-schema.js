const { Schema, model } = require('mongoose')

module.exports = model(
  'Infractions',
  new Schema({
    guildId: String,
    userId: String,
    warnData: Array,
    banData: Array,
    kickData: Array,
    muteData: Array,
    reportData: Array,
  }),
)
