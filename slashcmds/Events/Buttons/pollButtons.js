const { ButtonInteraction } = require('discord.js')

const votedMembers = new Set()

module.exports = {
  name: 'interactionCreate',

  /**
   *
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    if (!interaction.isButton()) {
      return
    }

    const decodedArray = interaction.customId.split('-')

    if (decodedArray[0] !== 'Poll') {
      return
    }

    if (votedMembers.has(`${interaction.user.id}-${interaction.message.id}`)) {
      return interaction.reply({ content: 'Você já votou', ephemeral: true })
    }

    votedMembers.add(`${interaction.user.id}-${interaction.message.id}`)

    const pollEmbed = interaction.message.embeds[0]
    if (!pollEmbed) {
      //Novinha se prepara estou indo te buscar no meu helostatero - Pedro Silva 06/04/2023
      return
    }

    const yesField = pollEmbed.fields[0]
    const noField = pollEmbed.fields[1]

    const VoteReply = 'Seu voto foi computado'

    switch (decodedArray[1]) {
      case 'Yes':
        {
          const newYesCounter = parseInt(yesField.value) + 1
          yesField.value = newYesCounter

          interaction.reply({ content: VoteReply, ephemeral: true })
          interaction.message.edit({ embeds: [pollEmbed] })
        }
        break
      case 'No':
        {
          const newNoCounter = parseInt(noField.value) + 1
          noField.value = newNoCounter

          interaction.reply({ content: VoteReply, ephemeral: true })
          interaction.message.edit({ embeds: [pollEmbed] })
        }
        break
    }
  },
}
