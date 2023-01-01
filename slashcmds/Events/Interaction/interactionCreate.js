const { ChatInputCommandInteraction } = require('discord.js')

module.exports = {
  name: 'interactionCreate',
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) {
      return
    }

    const command = client.slashcommands.get(interaction.commandName)

    if (command.developer && interaction.user.id !== '227559154007408641') {
      return interaction.reply({
        content: 'Esse comando só pode ser usado pelos desenvolvedores.',
        ephemeral: true,
      })
    }

    const subCommand = interaction.options.getSubcommand(false)

    if (subCommand) {
      const subCommandFile = client.slashsub.get(
        `${interaction.commandName}.${subCommand}`
      )

      if (!subCommandFile && command.subsincluded) {
        return command.execute(interaction, client)
      }

      subCommandFile.execute(interaction, client)
    } else {
      command.execute(interaction, client)
    }
  },
}
