const { CommandInteraction, MessageEmbed } = require('discord.js')
const db = require('../../../schemas/lock-down-schema')

module.exports = {
  name: 'unlock',
  description: 'Desbloqueie um canal',
  permission: 'MANAGE_CHANNELS',

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const { guild, channel } = interaction

    const embed = new MessageEmbed()

    if (channel.permissionsFor(guild.id).has('SEND_MESSAGES')) {
      return interaction.reply({
        embeds: [
          embed
            .setColor('RED')
            .setDescription('⛔ | Este canal não está bloqueado'),
        ],
        ephemeral: true,
      })
    }

    channel.permissionOverwrites.edit(guild.id, {
      SEND_MESSAGES: null,
    })

    await db.deleteOne({ channelId: channel.id })

    interaction.reply({
      embeds: [
        embed
          .setColor(process.env.EMBED_COLOR)
          .setDescription('🔓 | O canal foi desbloqueado com sucesso!'),
      ],
    })
  },
}
