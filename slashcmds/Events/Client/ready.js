const { Client } = require('discord.js')
const { loadCommands } = require('../../Handlers/Commands')

module.exports = {
  name: 'ready',
  once: true,

  /**
   *
   * @param {Client} client
   */

  execute(client) {
    // require('../../Systems/lockdown-system')(client)
    // require('../../Systems/chat-filter-system')(client)

    loadCommands(client)

    //Status custom aleatório
    setInterval(() => {
      const statuses = [
        `Criado por pedrohcs8#4185`,
        `Em desenvolvimento`,
        `Com host :)`,
        `Renato online!`,
        `Hospedado em um Raspberry Pi 4!`,
        `Online - Cluster 1-Renato-Host`,
      ]

      const status = statuses[Math.floor(Math.random() * statuses.length)]
      client.user.setActivity(status, { type: 'PLAYING' })
    }, 5000)

    console.log('Os slashcommands estão prontos!')
  },
}
