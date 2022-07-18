const {
  Client,
  CommandInteraction,
  Message,
  MessageEmbed,
} = require('discord.js')
const { execute } = require('../Client/ready')

module.exports = {
  name: 'interactionCreate',
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      const command = client.slashcommands.get(interaction.commandName)
      if (!command) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('RANDOM')
              .setDescription('🛑 - Um erro ocorreu'),
          ],
        })
      }

      if (command.permission && !interaction.member.permissions.has(command.permission)) {
            return interaction.reply({ content: `You do not have the required permission for this command: \`${interaction.commandName}\`.`, ephemeral: true })
      }

      console.log('SIIIII')
      command.execute(interaction, client)
    }
  },
}
