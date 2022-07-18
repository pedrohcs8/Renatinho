const { MessageEmbed, CommandInteraction } = require('discord.js')
const db = require('../../../schemas/ticket-schema')

module.exports = {
  name: 'ticket',
  description: 'Comando para adicionar ou remover membros dos tickets',
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: 'ações',
      type: 'STRING',
      description: 'Adiciona ou remove um membro deste ticket',
      required: true,
      choices: [
        {
          name: 'Adicionar',
          value: 'add',
        },
        {
          name: 'Remover',
          value: 'remove',
        },
      ],
    },
    {
      name: 'membro',
      description: 'Selecione um membro',
      type: 'USER',
      required: true,
    },
  ],

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const { guildId, options, channel } = interaction

    const action = options.getString('ações')
    const member = options.getMember('membro')

    const embed = new MessageEmbed()

    switch (action) {
      case 'add':
        db.findOne(
          { guildId: guildId, channelId: channel.id },
          async (err, docs) => {
            if (err) {
              throw err
            }

            if (!docs) {
              return interaction.reply({
                embeds: [
                  embed
                    .setColor('RED')
                    .setDescription(
                      '⛔ | Este canal não está ligado a um ticket'
                    ),
                ],
              })
            }

            if (docs.membersId.includes(member.id)) {
              return interaction.reply({
                embeds: [
                  embed
                    .setColor('RED')
                    .setDescription(
                      '⛔ | Este membro já foi adicionado a este ticket'
                    ),
                ],
                ephemeral: true,
              })
            }

            docs.membersId.push(member.id)

            channel.permissionOverwrites.edit(member.id, {
              SEND_MESSAGES: true,
              VIEW_CHANNEL: true,
              READ_MESSAGE_HISTORY: true,
            })

            interaction.reply({
              embeds: [
                embed
                  .setColor('GREEN')
                  .setDescription(
                    `✅ | O membro ${member} foi adicionado com suceso ao ticket.`
                  ),
              ],
            })
            docs.save()
          }
        )
        break

      case 'remove':
        db.findOne(
          { guildId: guildId, channelId: channel.id },
          async (err, docs) => {
            if (err) {
              throw err
            }

            if (!docs) {
              return interaction.reply({
                embeds: [
                  embed
                    .setColor('RED')
                    .setDescription(
                      '⛔ | Este canal não está ligado a um ticket'
                    ),
                ],
              })
            }

            if (!docs.membersId.includes(member.id)) {
              return interaction.reply({
                embeds: [
                  embed
                    .setColor('RED')
                    .setDescription('⛔ | Este membro não está neste ticket'),
                ],
                ephemeral: true,
              })
            }

            docs.membersId.remove(member.id)

            channel.permissionOverwrites.edit(member.id, {
              VIEW_CHANNEL: false,
            })

            interaction.reply({
              embeds: [
                embed
                  .setColor('GREEN')
                  .setDescription(
                    `✅ | O membro ${member} foi removido com suceso do ticket.`
                  ),
              ],
            })
            docs.save()
          }
        )
        break
    }
  },
}
