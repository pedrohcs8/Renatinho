const mongoose = require('mongoose')

const reqString = {
   type: String,
   required: true
}

const thankLeaderboardSchema = mongoose.Schema({
  //Guild Id
  _id: reqString,
  channelId: reqString
})

module.exports = mongoose.model('thanks-leaderboards-renato', thankLeaderboardSchema)