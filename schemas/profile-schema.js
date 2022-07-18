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
  shop: {
    itens: {
      water: {
        type: Object,
        default: { id: 1, size: 0, price: 100, name: 'Água', emoji: '🚿' },
      },
      coffee: {
        type: Object,
        default: { id: 2, size: 0, price: 250, name: 'Café', emoji: '☕' },
      },
      suco: {
        type: Object,
        default: { id: 3, size: 0, price: 300, name: 'Suco', emoji: '🧃' },
      },
      coca: {
        type: Object,
        default: { id: 4, size: 0, price: 400, name: 'Coca-Cola', emoji: '🥤' },
      },
      pepsi: {
        type: Object,
        default: { id: 5, size: 0, price: 400, name: 'Pepsi', emoji: '🥤' },
      },
      sorvete: {
        type: Object,
        default: { id: 6, size: 0, price: 500, name: 'Sorvete', emoji: '🍦' },
      },
      filéaparmegiana: {
        type: Object,
        default: {
          id: 7,
          size: 0,
          price: 1500,
          name: 'Filé A Parmegiana',
          emoji: '🥩',
        },
      },
      pasteldefrango: {
        type: Object,
        default: {
          id: 8,
          size: 0,
          price: 650,
          name: 'Pastel de Flango',
          emoji: '🍗',
        },
      },
      pasteldecarne: {
        type: Object,
        default: {
          id: 9,
          size: 0,
          price: 700,
          name: 'Filé A Carne',
          emoji: '🥩',
        },
      },
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
    itens: {},
  },
  customshopitens: {
    itens: { type: Array, default: [] },
  },
})

module.exports = mongoose.model('profiles', profileSchema)
