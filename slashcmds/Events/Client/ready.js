const { Client, ActivityType } = require('discord.js')
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
        `Criado por pedrohcs8`,
        `Em desenvolvimento`,
        `Com host :)`,
        `Renato online!`,
        `Meu prefixo padrão é .`,
        `Hospedado em um Raspberry Pi 4!`,
        `Online - Cluster 1-Renato-Host`,
        `Use .help se necessário`,
      ]

      const status = statuses[Math.floor(Math.random() * statuses.length)]
      client.user.setActivity(status, { type: ActivityType.Playing })
    }, 5000)

    console.log('Os slashcommands estão prontos!')
  },
}
