const Command = require('@util/structures/Command')
const translate = require('@iamtraction/google-translate')

module.exports = class TranslateCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'tradutor'
    this.category = 'Util'
    this.description = 'Comando para traduzir um texto para o português'
    this.usage = 'tradutor <linguagem(pt para português)> <text>'
    this.aliases = ['tradutor', 'translate', 'traduzir']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const text = args.slice(1).join(' ')

    if (!text) return message.reply(`insira á mensagem a ser traduzida.`)

    try {
      const trad = await translate(text, {
        to: args[0],
      })

      message.reply(`${message.author}\n\n${trad.text ? trad.text : ''}`)
    } catch (err) {
      console.log(err)
      if (err)
        if (
          err.message.startsWith('The language') &&
          err.message.endsWith('is not supported.')
        )
          return message.reply(`${message.author}, linguagem não suportada.`)
    }
  }
}
