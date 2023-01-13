const mongoose = require('mongoose')
const Schema = mongoose.Schema

let guildSchema = new Schema({
  idS: { type: String },
  userId: { type: String },
  prefix: { type: String, default: '.' },
  welcome: {
    status: { type: Boolean, default: false },
    channel: { type: String, default: 'null' },
    msg: { type: String, default: 'null' },
  },
  autorole: {
    status: { type: Boolean, default: false },
    roles: { type: Array, default: [] },
  },
  logs: {
    status: { type: Boolean, default: false },
    channel: { type: String, default: '' },
  },
  cmdblock: {
    status: { type: Boolean, default: false },
    channels: { type: Array, default: [] },
    cmds: { type: Array, default: [] },
    msg: { type: String, default: 'Proibido usar comandos aqui!' },
  },
  ticket: {
    guild: { type: String, default: 'null' },
    channel: { type: String, default: 'null' },
    msg: { type: String, default: 'null' },
    size: { type: Number, default: 0 },
    staff: { type: String, default: 'null' },
  },
  antinvite: {
    msg: { type: String, default: 'null' },
    status: { type: Boolean, default: false },
    channels: { type: Array, default: [] },
    roles: { type: Array, default: [] },
  },
  antifake: {
    status: { type: Boolean, default: false },
    days: { type: Number, default: 0 },
  },
  logs: {
    channel: { type: String, default: 'null' },
    status: { type: Boolean, default: false },
  },
  infoCall: {
    channels: { type: Array, default: [] },
    roles: { type: Array, default: [] },
  },
  registrador: {
    role: { type: String, default: 'null' },
    total: { type: Number, default: 0 },
  },
  youtube: { type: Array, default: [] },
  createCall: {
    status: { type: Boolean, default: false },
    category: { type: String, default: 'null' },
    channel: { type: String, default: 'null' },
    users: { type: Array, default: [] },
  },
  serverstats: {
    status: { type: Boolean, default: false },
    channels: {
      bot: { type: String, default: 'null' },
      users: { type: String, default: 'null' },
      total: { type: String, default: 'null' },
      category: { type: String, default: 'null' },
    },
  },
})

let Guild = mongoose.model('Guilds', guildSchema)
module.exports = Guild
