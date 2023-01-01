const { MessageEmbed, MessageAttachment } = require('discord.js')
const Command = require('@util/structures/Command')

module.exports = class McBodyCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'mcbody'
    this.category = 'Minecraft'
    this.description = 'Comando para ver o body de uma skin do mine.'
    this.usage = 'mcbody <nick>'
    this.aliases = ['mcbody']

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
      .setImage(`https://mc-heads.net/body/${nick}`)

    message.reply({ embeds: [embed] })
  }
}
