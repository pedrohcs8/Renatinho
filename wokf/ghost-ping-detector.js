//Detector de marcação fantasma
const ghostPingSchema = require('@schemas/ghost-ping-schema')
const { MessageEmbed } = require('discord.js')

const cache = {}

module.exports = (client) => {
  client.on('messageDelete', async (message) => {
    const { content, channel, author, guild, mentions } = message

    if (!author || author.bot || mentions.users.size === 0) {
      return
    }

    let channelId = cache[guild.id]
    if (!channelId) {
      const result = await ghostPingSchema.findById(guild.id)
      if (!result) {
        return
      }

      channelId = result.channelId
      cache[guild.id] = channelId
    }

    const embed = new MessageEmbed()
      .setTitle('Possível marcação fantasma detectada')
      .setDescription(`Mensagem: \n\n"${content}"`)
      .addField('Canal:', channel)
      .addField('Autor da mensagem:', author)

    const targetChannel = guild.channels.cache.get(channelId)
    if (targetChannel) {
      targetChannel.send({ embeds: [embed] })
    }
  })
}
