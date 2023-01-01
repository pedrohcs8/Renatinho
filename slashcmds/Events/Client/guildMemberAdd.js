const { EmbedBuilder } = require('@discordjs/builders')
const { GuildMember } = require('discord.js')
const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
  name: 'guildMemberAdd',

  /**
   *
   * @param {GuildMember} member
   */

  async execute(member) {
    const { user, guild } = member

    const doc = await guildSchema.findOne({ idS: guild.id })

    // SISTEMA DE BOAS VINDAS

    if (doc.welcome.status) {
      const welcomeChannelId = doc.welcome.channel
      const message = doc.welcome.msg
      const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId)

      const welcomeMessage = message
        .replace(/{member}/g, `<@${member.id}>`)
        .replace(/{name}/g, `${member.user.username}`)
        .replace(/{total}/g, guild.memberCount)
        .replace(/{guildName}/g, guild.name)

      welcomeChannel.send({ content: welcomeMessage })
    }

    // -------------

    //SISTEMA DE AUTOROLE

    if (doc.autorole.status) {
      member.roles.add(doc.autorole.roles, 'Sistema de AutoRole')
    }

    // -------------
  },
}
