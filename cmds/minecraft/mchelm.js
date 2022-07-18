const { MessageEmbed, MessageAttachment } = require('discord.js')
const Command = require('@util/structures/Command')

module.exports = class McHelmCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'mchelm'
    this.category = 'Minecraft'
    this.description = 'Comando para ver o helm de uma skin do mine.'
    this.usage = 'mchelm <nick>'
    this.aliases = ['mchelm']

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
      .setImage(`https://minotar.net/helm/${nick}/200.png`)

    message.reply({ embeds: [embed] })
  }
}
