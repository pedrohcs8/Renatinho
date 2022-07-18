const Command = require('@util/structures/Command')

module.exports = class WorkCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'roleclaim'
    this.category = 'Moderation'
    this.description = 'Comando para configurar o sistema de roleclaim'
    this.usage = 'roleclaim'
    this.aliases = ['rclaim', 'rolec']
    this.subcommands = ['send', 'addrole']
    this.reference = 'roleclaim'

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }
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
      'Utilize .roleclaim send <# do canal de texto> <mensagem antes do seletor> para começar.'
    )
  }
}
