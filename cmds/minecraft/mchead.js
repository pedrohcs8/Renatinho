const { MessageEmbed, MessageAttachment } = require('discord.js')
const Command = require('@util/structures/Command')

module.exports = class McHeadCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'mchead'
    this.category = 'Minecraft'
    this.description = 'Comando para ver a da cabeça de uma skin do mine.'
    this.usage = 'mchead <nick>'
    this.aliases = ['mchead']

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
      .setImage(`https://mc-heads.net/head/${nick}/200`)

    message.reply({ embeds: [embed] })
  }
}
