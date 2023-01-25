const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const profileSchema = mongoose.Schema({
  guildId: { type: String },
  userId: reqString,
  coins: {
    type: Number,
    default: 0,
  },
  name: { type: String, default: 'null' },
  Exp: {
    xp: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 100 },
    id: { type: String, default: 'null' },
    user: { type: String, default: 'null' },
    level: {
      type: Number,
      default: 1,
    },
  },
  about: { type: String, default: 'null' },
  reps: {
    size: { type: Number, default: 0 },
    lastRep: { type: String, default: 'null' },
    lastSend: { type: String, default: 'null' },
    time: { type: Number, default: 0 },
  },
  marry: {
    time: { type: Number, default: 0 },
    user: { type: String, default: 'null' },
    has: { type: Boolean, default: false },
  },
  ticket: {
    have: { type: Boolean, default: false },
    channel: { type: String, default: 'null' },
    created: { type: String, default: 'null' },
  },
  infoCall: {
    lastCall: { type: Number, default: 0 },
    totalCall: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    lastRegister: { type: Number, default: 0 },
  },
  backgrounds: {
    has: { type: Array, default: [] },
    active: { type: Number, default: 0 },
  },
  work: {
    exp: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 250 },
    cooldown: { type: Number, default: 0 },
    coins: { type: Number, default: 200 },
    name: { type: String, default: 'null' },
  },
  factory: {
    name: { type: String, default: 'null' },
    exp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 500 },
    owner: { type: String, default: 'null' },
    employers: { type: Array, default: [] },
    hasFactory: { type: Boolean, default: false },
    createFactory: { type: Boolean, default: false },
    lastWork: { type: Number, default: 0 },
  },
  bank: { type: Number, default: 0 },
  steal: {
    time: { type: Number, default: 0 },
    protection: { type: Number, default: 0 },
  },
  registrador: {
    registredBy: { type: String, default: 'null' },
    registredDate: { type: String, default: 'null' },
    registred: { type: Boolean, default: false },
    registreds: { type: Number, default: 0 },
  },
  ship: {
    users: { type: Array, default: [] },
    percentage: { type: Array, default: [] },
  },
  customshop: {
    name: { type: String, default: 'null' },
    owner: { type: String, default: 'null' },
    createShop: { type: Boolean, default: false },
    itens: { type: Array, default: [] },
  },
  customshopitens: { type: Array, default: [] },
  custombackground: {
    has: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    path: { type: String, default: '' },
    fontColor: { type: String, default: '' },
  },
})

module.exports = mongoose.model('profiles', profileSchema)
