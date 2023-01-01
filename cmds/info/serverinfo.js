const Command = require('@structures/Command')
const { MessageEmbed } = require('discord.js')

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'serverinfo'
    this.category = 'Info'
    this.description = 'Comando para mostrar as infos de um server.'
    this.usage = 'serverinfo'
    this.aliases = ['server-info']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }, t) {
    //comando de serverinfo
    const { guild } = message

    const { name, memberCount, afkTimeout } = guild
    const icon = guild.iconURL()

    const tag = message.guild.members.cache.get(message.guild.ownerId).user.tag

    const embed = new MessageEmbed()
      .setTitle(`${name}`)
      .setThumbnail(icon)
      .setColor('#0040FF')
      .addFields(
        {
          name: '💻ID',
          value: guild.id,
          inline: true,
        },
        {
          name: '👥Membros',
          value: memberCount.toString(),
          inline: true,
        },
        {
          name: '👑Dono(a)',
          value: tag,
          inline: true,
        },
        {
          name: '📆Criado em',
          value: guild.createdAt.toString(),
          inline: true,
        },
        {
          name: '📴AFK Timeout',
          value: (afkTimeout / 60).toString(),
          inline: true,
        },
      )

    message.reply({ embeds: [embed] })
  }
}
