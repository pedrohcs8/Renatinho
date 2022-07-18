//Informações das calls

const { MessageEmbed } = require('discord.js')
const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const moment = require('moment')
require('moment-duration-format')

module.exports = class InfoCallCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'infocall'
    this.category = 'Info'
    this.description = 'Informações do tempo gasto em suas calls.'
    this.usage = 'infocall || infocall status'
    this.aliases = ['infoc', 'info-call']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const User =
      message.mentions.users.first() ||
      message.author ||
      this.client.users.cache.get(args[1])

    const doc = await profileSchema.findOne({ userId: User.id })

    if (args[0] == 'status' || args[0] == 'stts') {
      const result = await profileSchema.findOne({ userId: message.author.id })

      if (result.infoCall.status) {
        message.reply(`O sistema já estava ativado, portanto desativei.`)
        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { 'infoCall.status': false } },
        )
        return
      } else if (!result.infoCall.status) {
        message.reply(`O sistema já estava desativado, portanto ativei.`)
        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { 'infoCall.status': true } },
        )
        return
      }

      return
    }

    if (doc.infoCall.lastRegister <= 0) {
      message.reply('Você/o membro nunca ficou em call pelo meu sistema.')
      return
    }

    const embed = new MessageEmbed()
      .setAuthor(
        `${User.tag} - Contador de tempo em Call`,
        User.displayAvatarURL({ dynamic: true }),
      )
      .setThumbnail(
        User.displayAvatarURL({ dynamic: true, format: 'jpg', size: 2048 }),
      )
      .setDescription(
        `${message.author} você está vendo informações da conta **${User.tag}**`,
      )
      .addFields(
        {
          name: 'Status da conta no sistema:',
          value: `O sistema está **${
            doc.infoCall.status ? 'ativado' : 'desativado'
          }** na conta do membro`,
        },
        {
          name: 'Tempo da última call',
          value: `**${moment
            .duration(doc.infoCall.lastRegister)
            .format('d [dias] h [horas] m [minutos] e s [segundos]')
            .replace('minsutos', 'minutos')}**`,
        },
        {
          name: 'Tempo total em call',
          value: `**${moment
            .duration(doc.infoCall.totalCall)
            .format('M [meses] d [dias] h [horas] m [minutos] e s [segundos]')
            .replace('minsutos', 'minutos')}**`,
        },
        {
          name: 'Como ativar/desativar o sistema',
          value: '> Para ativar/desativar o sistema use .infocall status',
        },
      )
      .setColor('#B40431')

    if (!args[0]) return message.reply({ embeds: [embed] })
  }
}
