const { CommandInteraction, MessageEmbed } = require('discord.js')
const db = require('../../../schemas/lock-down-schema')
const ms = require('ms')

module.exports = {
  name: 'lock',
  description: 'Comando para travar o canal',
  permission: 'MANAGE_CHANNELS',
  options: [
    {
      name: 'tempo',
      description: 'Tempo que o canal ficará bloqueado (1m, 1h, 1d)',
      type: 'STRING',
    },
    {
      name: 'motivo',
      description: 'O motivo deste canal ser bloqueado',
      type: 'STRING',
    },
  ],

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const { guild, channel, options } = interaction

    const reason =
      options.getString('motivo') || 'Nenhum motivo foi especificado'

    const embed = new MessageEmbed()

    if (!channel.permissionsFor(guild.id).has('SEND_MESSAGES')) {
      return interaction.reply({
        embeds: [
          embed
            .setColor('RED')
            .setDescription('⛔ | Este canal já está bloqueado'),
        ],
        ephemeral: true,
      })
    }

    channel.permissionOverwrites.edit(guild.id, {
      SEND_MESSAGES: false,
    })

    interaction.reply({
      embeds: [
        embed
          .setColor('RED')
          .setDescription(`🔐 | Este canal foi bloqueado. Motivo: ${reason}`),
      ],
    })

    const time = options.getString('tempo')

    if (time) {
      const expireDate = Date.now() + ms(time)
      db.create({ guildId: guild.id, channelId: channel.id, time: expireDate })

      setTimeout(async () => {
        channel.permissionOverwrites.edit(guild.id, {
          SEND_MESSAGES: null,
        })
        interaction
          .editReply({
            embeds: [
              embed
                .setDescription(
                  '🔓 | O canal foi desbloqueado pois o tempo de bloqueio acabou.'
                )
                .setColor(process.env.EMBED_COLOR),
            ],
          })
          .catch(() => {})
        await db.deleteOne({ channelId: channel.id })
      }, ms(time))
    }
  },
}
