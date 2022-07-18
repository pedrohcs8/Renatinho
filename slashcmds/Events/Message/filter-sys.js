const { Message, MessageEmbed, Client } = require('discord.js')

module.exports = {
  name: 'messageCreate',

  /**
   *
   * @param {Message} message
   * @param {Client} client
   */

  async execute(message, client) {
    if (message.author.bot) {
      return
    }

    const { content, guild, author, channel } = message

    const messageContent = content.toLowerCase().split(' ')

    const filter = client.filters.get(guild.id)

    if (!filter) {
      return
    }

    const wordsUsed = []

    let shouldDelete = false

    messageContent.forEach((w) => {
      if (filter.includes(w)) {
        wordsUsed.push(w)
        shouldDelete = true
      }
    })

    if (shouldDelete) {
      message.delete().catch(() => {})
    }

    if (wordsUsed.length) {
      const channelId = client.filtersLog.get(guild.id)

      if (!channelId) {
        return
      }

      const channelObject = guild.channels.cache.get(channelId)

      if (!channelObject) {
        return
      }

      const embed = new MessageEmbed()
        .setColor('RED')
        .setAuthor({
          name: author.tag,
          iconURL: author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          [
            `Foram usadas ${wordsUsed.length} palavra(s) no canal ${channel} =>`,
            `\`${wordsUsed.map((w) => w)}\``,
          ].join('\n')
        )

      channelObject.send({ embeds: [embed] })
    }
  },
}
