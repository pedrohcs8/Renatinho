const { Message, EmbedBuilder, Client } = require('discord.js')
const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
  name: 'messageDelete',

  /**
   *
   * @param {Message} message
   */

  async execute(message) {
    try {
      const doc = await guildSchema.findOne({ idS: message.guild.id })

      if (message.author.bot) {
        return
      }

      const logEmbed = new EmbedBuilder()
        .setColor(process.env.EMBED_COLOR)
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL(),
        })
        .setTitle('Mensagem deletada')
        .addFields(
          {
            name: 'Autor',
            value: `${message.author}`,
          },
          {
            name: 'Conteúdo da mensagem',
            value: `${message.content ? message.content : 'Nada'}`,
          },
          {
            name: 'Canal',
            value: `${message.channel}`,
          }
        )
        .setThumbnail(message.author.displayAvatarURL({}))
        .setFooter({
          text: `${message.author.tag} | ${message.author.id}`,
          iconURL: message.author.displayAvatarURL({}),
        })
        .setTimestamp()

      if (message.attachments.size >= 1) {
        logEmbed.addFields({
          name: 'Anexos',
          value: `${message.attachments.map((a) => a.url)}`,
          inline: true,
        })
      }

      if (doc.logs.status) {
        const channel = message.guild.channels.cache.get(doc.logs.channel)
        channel.send({ embeds: [logEmbed] })
      }
    } catch (err) {
      console.log(err)
    }
  },
}
