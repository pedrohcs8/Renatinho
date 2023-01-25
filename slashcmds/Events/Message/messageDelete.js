const { Message, EmbedBuilder, Client } = require('discord.js')
const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
  name: 'messageDelete',

  /**
   *
   * @param {Message} message
   * @param {Client} client
   */

  async execute(message, client) {
    guildSchema.findOne(
      { idS: message.guild.id },
      async function (err, server) {
        try {
          if (message.author.bot) return // caso um bot tenha deletado alguma mensagem ele não vai mandar no canal de LOGS.
          const guild = message.guild

          const UPDATE = new EmbedBuilder()
            .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
            .setTitle(`Mensagem Deletada`)
            .addFields(
              {
                name: `Author`,
                value: `${message.author}`, // pega o author da mensagem
              },
              {
                name: `Conteúdo da Mensagem`,
                value: `${message.content}`, // pega o contéudo da mensagem
              },
              {
                name: `Canal`,
                value: `${message.channel}`, // pega o canal que a mensagem foi deletada
              }
            )
            .setThumbnail(
              message.author.displayAvatarURL({ dynamic: true, size: 2048 })
            )
            .setFooter(
              `${message.author.tag} | ${message.author.id}`,
              message.author.displayAvatarURL({ dynamic: true, size: 2048 })
            )
            .setTimestamp()
            .setColor(process.env.EMBED_COLOR)

          if (server.logs.status) {
            const channel = guild.channels.cache.get(server.logs.channel)
            channel.send({ embeds: [UPDATE] })
          }
        } catch (err) {
          console.log(`EVENTO: MessageDelete`)
        }
      }
    )
  },
}
