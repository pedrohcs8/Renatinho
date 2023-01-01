const {
  ButtonInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require('discord.js')
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

    const { guild, member, customId } = interaction

    const data = await ticketData.findOne({ guildId: guild.id })
    if (!data) {
      return
    }

    if (!data.buttons.includes(customId)) {
      return
    }

    const id = Math.floor(Math.random() * 90000) + 10000

    await guild.channels
      .create(`${customId + '-' + id}`, {
        type: 'GUILD_TEXT',
        parent: data.category,
        permissionOverwrites: [
          {
            id: member.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
          },
          {
            id: data.everyone,
            deny: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
          },
        ],
      })
      .then(async (channel) => {
        await db.create({
          guildId: guild.id,
          membersId: member.id,
          ticketId: id,
          channelId: channel.id,
          closed: false,
          locked: false,
          type: customId,
          claimed: false,
        })

        const embed = new MessageEmbed()
          .setAuthor({
            name: `${guild.name} | Ticket: ${id}`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setDescription(
            'Por favor espere por uma resposta da Staff pacientemente, enquanto isso descreva detalhadamente o seu problema.'
          )
          .setFooter({
            text: 'Os botões abaixo só podem ser usados pela Staff!',
          })
          .setColor(process.env.EMBED_COLOR)

        const buttons = new MessageActionRow()
        buttons.addComponents(
          new MessageButton()
            .setCustomId('close')
            .setLabel('Salvar e Fechar')
            .setStyle('PRIMARY')
            .setEmoji('💾'),
          new MessageButton()
            .setCustomId('lock')
            .setLabel('Travar')
            .setStyle('DANGER')
            .setEmoji('🔐'),
          new MessageButton()
            .setCustomId('unlock')
            .setLabel('Destravar')
            .setStyle('SUCCESS')
            .setEmoji('🔓'),
          new MessageButton()
            .setCustomId('claim')
            .setLabel('Assumir')
            .setStyle('SECONDARY')
            .setEmoji('🛄')
        )

        channel.send({
          embeds: [embed],
          components: [buttons],
        })

        await channel
          .send({ content: `${member} aqui está o seu ticket` })
          .then((m) => {
            setTimeout(() => {
              m.delete().catch(() => {})
            }, 1 * 5000)
          })

        interaction.reply({
          content: `${member}, seu ticket foi criado: ${channel}`,
          ephemeral: true,
        })
      })
  },
}
