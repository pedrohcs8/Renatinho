const { Message, EmbedBuilder, Client } = require('discord.js')
const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
  name: 'messageUpdate',

  async execute(newMessage, oldMessage) {
    const doc = await guildSchema.findOne({ idS: oldMessage.guild.id })

    if (oldMessage.author.bot) {
      return
    }

    if (oldMessage.content == newMessage.content) {
      return
    }

    const Count = 1950

    const original =
      oldMessage.content.slice(0, Count) +
      (oldMessage.content.length > 1950 ? ' ...' : '')

    const edited =
      newMessage.content.slice(0, Count) +
      (newMessage.content.length > 1950 ? ' ...' : '')

    const logEmbed = new EmbedBuilder()
      .setColor(process.env.EMBED_COLOR)
      .setDescription(
        `📘 Uma  [mensagem](${newMessage.url}) por ${newMessage.author} foi **editada** em ${newMessage.channel}.\n
        **Original:**\n ${original} \n**Editada**:\n ${edited}`
      )
      .setFooter({
        text: `Membro: ${newMessage.author.tag} | ID: ${newMessage.author.id}`,
      })

    if (doc.logs.status) {
      const channel = newMessage.guild.channels.cache.get(doc.logs.channel)
      channel.send({ embeds: [logEmbed] })
    }
  },
}
