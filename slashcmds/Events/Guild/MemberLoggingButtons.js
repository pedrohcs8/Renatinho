const {
  ButtonInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require('discord.js')

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

    const splitArray = interaction.customId.split('-')

    if (splitArray[0] !== 'MemberLogging') {
      return
    }

    const member = (await interaction.guild.members.fetch()).get(splitArray[2])
    const embed = new EmbedBuilder()
    const errorArray = []

    if (!member) {
      return interaction.reply('Esse membro não faz mais parte desse servidor')
    }

    if (!member.moderatable) {
      errorArray.push(
        'Eu não tenho um cargo ou permissão suficiente para kickar/banir esse membro'
      )
    }

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      errorArray.push('Você não tem permissão para kickar membros')
    }

    if (errorArray.length) {
      return interaction.reply({
        embeds: [embed.setDescription(errorArray.join('\n')).setColor('Red')],
        ephemeral: true,
      })
    }

    switch (splitArray[1]) {
      case 'Kick':
        {
          member
            .kick(
              `Membro kickado por ${interaction.user.tag} | Sistema de Log de Membros by Renatinho`
            )
            .then(() => {
              interaction
                .reply({
                  embeds: [
                    embed
                      .setDescription(`O membro ${member} foi kickado`)
                      .setColor('Green'),
                  ],
                })
                .catch(() => {
                  interaction.reply({
                    embeds: [
                      embed
                        .setDescription(
                          `O membro ${member} não pode ser kickado`
                        )
                        .setColor('Red'),
                    ],
                  })
                })
            })
        }
        break

      case 'Ban':
        {
          member
            .ban(
              `Membro banido por ${interaction.user.tag} | Sistema de Log de Membros by Renatinho`
            )
            .then(() => {
              interaction
                .reply({
                  embeds: [
                    embed.setDescription(`O membro ${member} foi banido`),
                  ],
                })
                .catch(() => {
                  interaction.reply(`O membro ${member} não pode ser banido`)
                })
            })
        }
        break
    }
  },
}
