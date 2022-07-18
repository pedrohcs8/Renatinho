const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true
}

const ghostPingShema = new mongoose.Schema({
  _id: reqString, // Guild ID
  channelId: reqString,
})

const name = 'ghost-ping-channels-renato'

module.exports = mongoose.model[name] || mongoose.model(name, ghostPingShema)