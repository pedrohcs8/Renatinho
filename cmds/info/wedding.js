const Command = require('@structures/Command')
const profileSchema = require('@schemas/profile-schema')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
require('moment-duration-format')

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'wedding'
    this.category = 'Info'
    this.description = 'Informações de seu casamento.'
    this.usage = 'wedding [@ da pessoa]'
    this.aliases = ['casamento', 'wedding']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }, t) {
    moment.locale('pt-BR')
    const user =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      message.author

    const doc = await profileSchema.findOne({
      userId: user.id,
    })

    if (!doc.marry.has)
      return message.reply(`${message.author}, você/o usuário não está casado.`)

    const par = await this.client.users.fetch(doc.marry.user)

    const EMBED = new MessageEmbed(user)
      .setThumbnail(
        par.displayAvatarURL({ dynamic: true, format: 'jpg', size: 2048 }),
      )
      .setDescription(`> Informações sobre o casamento do(a) ${user}.`)
      .addFields(
        {
          name: `Par do Usuário`,
          value: `**${par.tag}** \`( ${par.id} )\``,
        },
        {
          name: `Data do Casamento`,
          value: `**${moment
            .duration(Date.now() - doc.marry.time)
            .format('M [M] d [d] h [h] m [m] s [s]')}** \`( ${moment(
            doc.marry.time,
          ).format('L LT')} )\``,
        },
      )

    message.reply({ embeds: [EMBED] })
  }
}
