const { ButtonInteraction } = require('discord.js')
const { returnToHome } = require('../../../Commands/Information/help')

module.exports = {
  name: 'interactionCreate',

  /**
   *
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    if (
      !interaction.isButton() ||
      interaction.customId !== 'help_return_home'
    ) {
      return
    }

    returnToHome(interaction)
  },
}
