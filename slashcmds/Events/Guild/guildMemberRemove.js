const { GuildMember, EmbedBuilder, Client } = require('discord.js')
const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
  name: 'guildMemberRemove',

  /**
   *
   * @param {GuildMember} member
   * @param {Client} client
   */

  async execute(member, client) {
    const { user, guild } = member

    const doc = await guildSchema.findOne({ idS: guild.id })

    console.log(
      `${member.user.tag} (${member.id}) saiu do server ${member.guild.name}`
    )

    if (doc.logs.status) {
      const guildConfig = client.guildConfig.get(member.guild.id)

      if (!guildConfig) {
        return
      }

      const logChannel = (await member.guild.channels.fetch()).get(
        guildConfig.logChannel
      )

      if (!logChannel) {
        return
      }

      const accountCreation = parseInt(member.user.createdTimestamp / 1000)

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${member.user.tag} | ${member.id}`,
          iconURL: member.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(
          member.user.displayAvatarURL({ dynamic: true, size: 256 })
        )
        .setDescription(
          [
            `• Usuário: ${member.user}`,
            `• Tipo de Conta: ${member.user.bot ? 'Bot' : 'Usuário'}`,
            `• Conta criada em: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
          ].join('\n')
        )
        .setFooter({ text: 'O membro saiu do servidor' })
        .setTimestamp()
        .setColor('Red')

      logChannel.send({ embeds: [embed] })
    }

    // TODO: IMPLEMENTAR SISTEMA DE CONTAR MEMBROS NO CANAL
    if (doc.serverstats.status) {
      const st = doc.serverstats
      const ch = st.channels

      if (ch.total != 'null') {
        let channel = guild.channels.cache.get(ch.total)

        channel.setName(`Total: ${guild.memberCount.toLocaleString()}`)
      }

      if (ch.bot != 'null') {
        let channel = guild.channels.cache.get(ch.bot)

        channel.setName(
          `Bots: ${guild.members.cache
            .filter((x) => x.user.bot)
            .size.toLocaleString()}`
        )
      }

      if (ch.users != 'null') {
        let channel = guild.channels.cache.get(ch.users)

        channel.setName(
          `Usuários: ${guild.members.cache
            .filter((x) => !x.user.bot)
            .size.toLocaleString()}`
        )
      }
    }
  },
}
