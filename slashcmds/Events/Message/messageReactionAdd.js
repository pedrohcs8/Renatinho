const { User, Client } = require('discord.js')
const reactionRolesSchema = require('../../../schemas/reaction-roles-schema')

module.exports = {
  name: 'messageReactionAdd',

  /**
   *
   * @param {*} reaction
   * @param {User} user
   * @param {Client} client
   */

  async execute(reaction, user, client) {
    if (!reaction.message.guildId) {
      return
    }

    if (user.bot) {
      return
    }

    let cID = `<${reaction.emoji.name}:${reaction.emoji.id}>`
    if (!reaction.emoji.id) {
      cID = reaction.emoji.name
    }

    const data = await reactionRolesSchema.findOne({
      guildId: reaction.message.guildId,
      message: reaction.message.id,
      emoji: cID,
    })
    if (!data) {
      return
    }

    const guild = client.guilds.cache.get(reaction.message.guildId)
    const member = guild.members.cache.get(user.id)

    try {
      await member.roles.add(data.role)
    } catch (e) {
      return
    }
  },
}
