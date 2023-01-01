const Command = require('@util/structures/Command')

module.exports = class Eval extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'eval'
    this.category = 'Dono'
    this.description = 'Comando para testar códigos'
    this.usage = 'eval <código>'
    this.aliases = ['eval']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (message.author.id !== '227559154007408641')
      return message.reply('Só o pedro pode usar esse comando!')
    if (!args[0]) return

    let litchdelicia = args.join(' ')
    let litchtotoso = eval(litchdelicia)
    if (typeof litchtotoso !== 'string')
      litchtotoso = require('util').inspect(litchtotoso, { depth: 0 })
    message.reply(
      `Entrada: \`\`\`js\n${litchdelicia}\`\`\`\n Saída: \`\`\`js\n${litchtotoso}\`\`\``,
    )
  }
}
