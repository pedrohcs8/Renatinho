const {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Pong!'),

  /**
   *
   * @param {CommandInteraction} interaction
   */

  execute(interaction) {
    interaction.reply({ content: 'Pong!', ephemeral: true })
  },
}
