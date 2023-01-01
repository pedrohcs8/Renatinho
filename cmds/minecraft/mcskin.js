const { MessageEmbed, MessageAttachment } = require('discord.js')
const Command = require('@util/structures/Command')

module.exports = class McSkinCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'mcskin'
    this.category = 'Minecraft'
    this.description = 'Mostra a skin de um player de mine.'
    this.usage = 'mcskin <nick>'
    this.aliases = ['mcskin']

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
      .setImage(`https://mc-heads.net/body/${nick}/300`)

    message.reply({ embeds: [embed] })
  }
}
