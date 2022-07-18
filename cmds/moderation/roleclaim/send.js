const Command = require('@util/structures/Command')


module.exports = class Name extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'send'
    this.category = 'Moderation'
    this.description = 'Comando para mandar a mensagem com o seletor'
    this.usage = 'roleclaim send <# do canal de texto> <mensagem antes do seletor>'
    this.aliases = ['s']
    this.reference = 'roleclaim'

    this.enabled = true
    this.guildOnly = true
    this.isSub = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }

    const channel = message.mentions.channels.first()

    if (!channel || channel.type !== 'GUILD_TEXT') {
      message.reply(
        'O canal mencionado é inválido, inexistente ou não é de texto.',
      )
      return
    }

    args.shift()
    args.shift()

    console.log(args)
    const text = args.join(' ')

    message.delete()
    message.channel.send('Mensagem mandada com sucesso!')

    channel.send(text)
  }
}
