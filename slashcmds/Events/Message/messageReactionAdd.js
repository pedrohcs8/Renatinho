const { User, Client, MessageReaction } = require('discord.js')
const reactionRolesSchema = require('../../../schemas/reaction-roles-schema')

module.exports = {
  name: 'messageReactionAdd',

  /**
   *
   * @param {MessageReaction} reaction
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

    const data = await reactionRolesSchema.findOne({
      guildId: reaction.message.guildId,
      message: reaction.message.id,
      emoji: reaction.emoji.name,
    })

    if (!data) {
      return
    }

    const member = await reaction.message.guild.members.fetch(user.id)

    try {
      const role = reaction.message.guild.roles.cache.find(
        (x) => x.id == data.role
      )

      await member.roles.add(role)
    } catch (e) {
      console.log(e)
      return
    }
  },
}
