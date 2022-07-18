const {
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require('discord.js')
const db = require('../../../schemas/suggest-schema')

module.exports = {
  name: 'suggest',
  description: 'Sugerir algo',
  options: [
    {
      name: 'tipo',
      description: 'Selecione uma opção',
      type: 'STRING',
      required: true,
      choices: [
        {
          name: 'Comando',
          value: 'Commando',
        },
        {
          name: 'Servidor',
          value: 'Servidor',
        },
        {
          name: 'Sistema',
          value: 'Sistema',
        },
        {
          name: 'Outro',
          value: 'Outro',
        },
      ],
    },
    {
      name: 'sugestão',
      description: 'Descreva sua sugestão',
      type: 'STRING',
      required: true,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, guildId, member, user } = interaction

    const Type = options.getString('tipo')
    const Suggestion = options.getString('sugestão')

    const Embed = new MessageEmbed()
      .setColor('#8000FF')
      .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: 'Sugestão',
          value: Suggestion,
          inline: false,
        },
        {
          name: 'Tipo',
          value: Type,
          inline: true,
        },
        {
          name: 'Status',
          value: 'Pendente',
          inline: true,
        }
      )
      .setTimestamp()

    const buttons = new MessageActionRow()
    buttons.addComponents(
      new MessageButton()
        .setCustomId('aceitar')
        .setLabel('✅ Aceitar')
        .setStyle('SUCCESS'),
      new MessageButton()
        .setCustomId('rejeitar')
        .setLabel('❌ Recusar')
        .setStyle('DANGER')
    )

    try {
      const m = await interaction.reply({
        embeds: [Embed],
        components: [buttons],
        fetchReply: true,
      })

      await db.create({
        guildId: guildId,
        messageId: m.id,
        details: [
          {
            memberId: member.id,
            tyoe: Type,
            suggestion: Suggestion,
          },
        ],
      })
    } catch (err) {
      console.log(err)
    }
  },
}
