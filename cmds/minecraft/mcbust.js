const { MessageEmbed, MessageAttachment } = require('discord.js')
const Command = require('@util/structures/Command')

module.exports = class McBustCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'mcbust'
    this.category = 'Minecraft'
    this.description = 'Comando para ver o bust de uma skin do mine.'
    this.usage = 'mcbust <nick>'
    this.aliases = ['mcbust']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const nick = args[0]

    if (!nick) {
      message.reply('Você deve inserir o nick da pessoa para mostrar a skin')
    }

    const embed = new MessageEmbed()
      .setTitle(`Nick: ${nick}`)
      .setImage(`https://minotar.net/bust/${nick}/200.png`)

    message.reply({ embeds: [embed] })
  }
}
