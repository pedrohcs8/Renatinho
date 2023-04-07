const { ButtonInteraction, MessageEmbed } = require('discord.js')
const { createTranscript } = require('discord-html-transcripts')

const db = require('../../../schemas/ticket-schema')
const ticketData = require('../../../schemas/ticket-setup')

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

    const { guild, customId, channel, member } = interaction

    const ticketSetup = await ticketData.findOne({ guildId: guild.id })
    if (!ticketSetup) {
      return
      // return interaction.reply({
      //   content:
      //     'O sistema dos tickets não foi configurado ou está desatualizado',
      // })
    }

    if (!['close', 'lock', 'unlock', 'claim'].includes(customId)) {
      return
    }

    if (!member.roles.cache.find((r) => r.id === ticketSetup.handlers)) {
      return interaction.reply({
        content: 'Você não pode usar estes botões!',
        ephemeral: true,
      })
    }

    const embed = new MessageEmbed().setColor(process.env.EMBED_COLOR)

    db.findOne({ channelId: channel.id }, async (err, docs) => {
      if (err) {
        throw err
      }

      if (!docs) {
        interaction.reply({
          content: 'Nenhum dado foi encontrado na minha database.',
          ephemeral: true,
        })
      }

      switch (customId) {
        case 'lock':
          if (docs.locked == true) {
            return interaction.reply({
              content: 'Este ticket já está travado',
              ephemeral: true,
            })
          }

          await db.updateOne({ channelId: channel.id }, { locked: true })
          embed.setDescription(
            '🔐 Este ticket foi travado para ser olhado por um Staff.'
          )
          docs.membersId.forEach((m) => {
            channel.permissionOverwrites.edit(m, {
              SEND_MESSAGES: false,
            })
          })

          interaction.reply({ embeds: [embed] })
          break

        case 'unlock':
          if (docs.locked == false) {
            return interaction.reply({
              content: 'Este ticket já está destravado',
              ephemeral: true,
            })
          }

          await db.updateOne({ channelId: channel.id }, { locked: false })
          embed.setDescription('🔓 Este ticket agora está destravado.')
          docs.membersId.forEach((m) => {
            channel.permissionOverwrites.edit(m, {
              SEND_MESSAGES: true,
            })
          })

          interaction.reply({ embeds: [embed] })
          break

        case 'close':
          if (docs.closed == true) {
            return interaction.reply({
              content: 'Este ticket já foi fechado, espere ele ser deletado',
              ephemeral: true,
            })
          }
          const attachment = await createTranscript(channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${docs.type} - ${docs.ticketId}.html`,
          })

          await db.updateOne({ channelId: channel.id }, { closed: true })

          const message = await guild.channels.cache
            .get(ticketSetup.transcripts)
            .send({
              embeds: [
                embed.setTitle(
                  `Tipo da Transcrição: ${docs.type}\nID: ${docs.ticketId}`
                ),
              ],
              files: [attachment],
            })

          interaction.reply({
            embeds: [
              embed.setDescription(
                `A transcrição foi salva com sucesso [Clique Aqui](${message.url})`
              ),
            ],
          })

          setTimeout(() => {
            db.deleteOne({ channelId: channel.id })
            channel.delete()
          }, 10 * 1000)
          break

        case 'claim':
          if (docs.claimed == true) {
            return interaction.reply({
              content: `Este ticket já foi assumido por <@${docs.claimedBy}>`,
              ephemeral: true,
            })
          }

          await db.updateOne(
            { channelId: channel.id },
            { claimed: true, claimedBy: member.id }
          )

          embed.setDescription(`🛄 Este ticket foi assumido por ${member}`)
          interaction.channel.send({ embeds: [embed] })

          break
      }
    })
  },
}
