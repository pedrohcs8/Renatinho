const Command = require('@structures/Command')
const { MessageEmbed } = require('discord.js')

module.exports = class SayEmbedCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'say-embed'
    this.category = 'Moderation'
    this.description = 'Comando para mandar uma mensagem pelo bot em embed'
    this.usage = 'sayembed <message>'
    this.aliases = ['sayembed', 'say-embed', 'say-e']

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

    const embed = new MessageEmbed()
      .setDescription(msg)
      .setFooter(
        `Mensagem enviada por ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true }),
      )

    message.reply({ embeds: [embed] })
  }
}
