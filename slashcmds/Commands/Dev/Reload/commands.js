const { ChatInputCommandInteraction, Client } = require('discord.js')
const { loadCommands } = require('../../../Handlers/Commands')

module.exports = {
  subCommand: 'reload.comandos',

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  execute(interaction, client) {
    loadCommands(client)
    interaction.reply({ content: 'Comandos recarregados com sucesso!' })
  },
}
