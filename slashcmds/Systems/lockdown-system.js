const { Client } = require('discord.js')
const db = require('../../schemas/lock-down-schema')

/**
 * @param {Client} client
 */

module.exports = async (client) => {
  db.find().then(async (documentsArray) => {
    documentsArray.forEach(async (d) => {
      const channel = client.guilds.cache
        .get(d.guildId)
        .channels.cache.get(d.channelId)
      if (!channel) {
        return
      }

      const timeNow = Date.now()

      if (d.time < timeNow) {
        return channel.permissionOverwrites.edit(d.guildId, {
          SEND_MESSAGES: null,
        })
        await db.deleteOne({ channelId: channel.id })
      }

      const expireDate = d.time - Date.now()

      setTimeout(async () => {
        channel.permissionOverwrites.edit(d.guildId, {
          SEND_MESSAGES: null,
        })

        await db.deleteOne({ channelId: channel.id })
      }, expireDate)
    })
  })
}
