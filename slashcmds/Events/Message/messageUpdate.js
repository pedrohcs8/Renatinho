const { Message, EmbedBuilder, Client } = require('discord.js')
const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
  name: 'messageUpdate',

  async execute(newMessage, oldMessage, client) {
    guildSchema.findOne({ idS: newMessage.guild.id }, async (err, server) => {
      try {
        if (newMessage.author.bot) return // caso um bot tenha editado alguma mensagem ele não vai mandar no canal de LOGS.
        const guild = newMessage.guild

        if (oldMessage.content === newMessage.content) return

        this.client.emit('messageCreate', newMessage)

        const UPDATE = new EmbedBuilder()
          .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
          .setTitle(`Mensagem Editada`)
          .addFields(
            {
              name: `Author`,
              value: `${newMessage.author}`, // pega o author da mensagem
            },
            {
              name: `Mensagem Anterior`,
              value: `${oldMessage.content}`,
            },
            {
              name: `Mensagem Posterior`,
              value: `${newMessage.content}`,
            },
            {
              name: `Canal`,
              value: `${newMessage.channel}`,
            }
          )
          .setThumbnail(
            newMessage.author.displayAvatarURL({ dynamic: true, size: 2048 })
          )
          .setFooter(
            `${newMessage.author.tag} | ${newMessage.author.id}`,
            newMessage.author.displayAvatarURL({ dynamic: true, size: 2048 })
          )
          .setTimestamp()
          .setColor(process.env.EMBED_COLOR)

        if (server.logs.status) {
          const channel = guild.channels.cache.get(server.logs.channel)
          channel.send({ embeds: [UPDATE] })
        }
      } catch (err) {
        console.log(`EVENTO: MessageUpdate ${err}`)
      }
    })
  },
}
