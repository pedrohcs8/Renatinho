const Command = require('@util/structures/Command')

module.exports = class DivorceCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'superspam'
    this.category = 'Iraq Technology'
    this.description = 'Ultra Spam.'
    this.usage = 'superspam <quantidade> <texto>'
    this.aliases = ['iraqspam']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    message.delete()
    message.channel.send('Super spam has started!')
    for (var i = 0; i < parseInt(args[0]); i++) {
      console.log(i)
      message.channel.send(args.slice(1, args.length).join(' ')).then((x) => console.log(i--))
    }
  }
}
