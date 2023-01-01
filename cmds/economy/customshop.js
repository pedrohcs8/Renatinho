const Command = require('@util/structures/Command')
const economy = require('@features/economy')
const profileSchema = require('../../schemas/profile-schema')

module.exports = class CreateShopCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'customshop'
    this.category = 'Economy'
    this.description = 'Comando para criar/gerenciar sua lojinha'
    this.usage = 'customshop'
    this.aliases = []
    this.subcommands = [
      'additem',
      'create',
      'delete',
      'name',
      'removeitem',
      'restock',
      'warehouse',
    ]
    this.reference = 'customshop'

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const subs =
      args[0] &&
      this.client.subcommands
        .get(this.reference)
        .find(
          (cmd) =>
            cmd.name.toLowerCase() === args[0].toLowerCase() ||
            cmd.aliases.includes(args[0].toLowerCase())
        )

    let subcmd
    let sub

    if (!subs) {
      sub = 'null'
      this.client.subcommands
        .get(this.reference)
        .find(
          (cmd) =>
            cmd.name.toLowerCase() === sub.toLowerCase() ||
            cmd.aliases.includes(sub.toLowerCase())
        )
    } else subcmd = subs

    if (subcmd != undefined)
      return subcmd.run({ message, args, prefix, author })

    message.reply(
      `Os subcomandos para mecher em sua loja são ${this.subcommands.join(' ')}`
    )
  }
}
