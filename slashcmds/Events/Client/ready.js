const { Client, ActivityType } = require('discord.js')
const { loadCommands } = require('../../Handlers/Commands')

module.exports = {
  name: 'ready',
  once: true,

  /**
   *
   * @param {Client} client
   */

  async execute(client) {
    // require('../../Systems/lockdown-system')(client)
    // require('../../Systems/chat-filter-system')(client)

    loadCommands(client)
  },
}
