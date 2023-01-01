const config = require('./config.json')
const { ShardingManager } = require('discord.js'),
  manager = new ShardingManager(`./index.js`, {
    totalShards: 'auto',
    token: config.token,
    respawn: true,
  })

manager.spawn()
