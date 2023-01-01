const mongoose = require('mongoose')
const Schema = mongoose.Schema

let clientSchema = new Schema({
  _id: { type: String },
  ranks: {
    coins: { type: Array, default: [] },
  },
})

let Client = mongoose.model('Client-Renato', clientSchema)
module.exports = Client
