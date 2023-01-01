//Soma números
const Command = require('@util/structures/Command')

module.exports = class AddCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'add'
    this.category = 'Misc'
    this.description = 'Comando para somar números'
    this.usage = 'add [número] [número]...'
    this.aliases = ['add', 'somar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    let sum = 0

    for (const arg of args) {
      sum += parseInt(arg)
    }

    message.reply(`O resultado é ${sum}`)
  }
}
