const { MessageEmbed, MessageAttachment } = require('discord.js')
const Command = require('@util/structures/Command')

module.exports = class McPlayerCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'mcplayer'
    this.category = 'Minecraft'
    this.description = 'Comnado para ver a skin de um player de mine.'
    this.usage = 'mcplayer <nick>'
    this.aliases = ['mcplayer']

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
      .setImage(`https://mc-heads.net/player/${nick}`)

    message.reply({ embeds: [embed] })
  }
}
