const { CommandInteraction, MessageEmbed } = require('discord.js')
const db = require('../../../schemas/afk-schema')

module.exports = {
  name: 'afk',
  description:
    'Sistema de mandar uma mensagem quando estiver AFK para quem te mencionar',
  options: [
    {
      name: 'set',
      type: 'SUB_COMMAND',
      description: 'Seta seu status AFK',
      options: [
        {
          name: 'status',
          description: 'Seta sua mensagem quando estiver AFK',
          type: 'STRING',
          required: true,
        },
      ],
    },
    {
      name: 'return',
      type: 'SUB_COMMAND',
      description: 'Desativa o sistema de recado.',
    },
  ],

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const { guild, options, user, createdTimestamp } = interaction

    const Embed = new MessageEmbed()
      .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
      .setColor(process.env.EMBED_COLOR)

    const afkStatus = options.getString('status')

    try {
      switch (options.getSubcommand()) {
        case 'set': {
          await db.findOneAndUpdate(
            { guildId: guild.id, userId: user.id },
            { status: afkStatus, time: parseInt(createdTimestamp / 1000) },
            { new: true, upsert: true }
          )

          Embed.setDescription(`Seu status afk foi alterado para ${afkStatus}`)

          return interaction.reply({ embeds: [Embed], ephemeral: true })
        }

        case 'return': {
          await db.deleteOne({ guildId: guild.id, userId: user.id })
          Embed.setDescription(`Seu status afk foi removido com sucesso`)

          return interaction.reply({ embeds: [Embed], ephemeral: true })
        }
      }
    } catch (err) {
      console.log(err)
    }
  },
}
