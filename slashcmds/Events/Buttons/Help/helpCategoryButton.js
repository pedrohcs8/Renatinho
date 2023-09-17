const { ButtonInteraction, Client } = require('discord.js')

const { returnFromCommand } = require('../../Interaction/helpMenu')

module.exports = {
  name: 'interactionCreate',

  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    if (
      !interaction.isButton() ||
      !interaction.customId.startsWith('help_return_category')
    ) {
      return
    }

    const category = interaction.customId.split('_')[3]

    returnFromCommand(interaction, category)
  },
}
