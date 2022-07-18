const Command = require('@structures/Command')
const { MessageEmbed } = require('discord.js')

module.exports = class ServerInfo extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'sorteio'
    this.category = 'Misc'
    this.description = 'Comando para sortear um número de 1 à 1000.'
    this.usage = 'sorteio'
    this.aliases = ['sortear']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }, t) {
    const sorteado = Math.floor(Math.random() * 1000) + 1
    message.reply(`O número sorteado é ${sorteado}`)
  }
}
