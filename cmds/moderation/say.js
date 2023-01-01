const Command = require('@structures/Command')
const { MessageEmbed } = require('discord.js')

module.exports = class SayEmbedCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'say'
    this.category = 'Moderation'
    this.description = 'Comando para mandar uma mensagem pelo bot'
    this.usage = 'say <message>'
    this.aliases = ['say']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }

    const msg = args.join(' ')

    if (!msg) {
      message.reply('Você deve inserir oque deseja anunciar primeiro')
      return
    }

    await message.delete()

    message.channel.send(msg)
  }
}
