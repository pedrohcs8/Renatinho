const { GuildMember, EmbedBuilder, Client } = require('discord.js')

module.exports = {
  name: 'guildMemberRemove',

  /**
   *
   * @param {GuildMember} member
   * @param {Client} client
   */

  async execute(member, client) {
    console.log(`${member.id} saiu do server ${member.guild.name}`)

    const guildConfig = client.guildConfig.get(member.guild.id)

    console.log(client.guildConfig.get(member.guild.id))

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
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
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
  },
}
