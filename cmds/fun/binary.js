const Command = require('@util/structures/Command')
const axios = require('axios')

module.exports = class BinaryCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'binary'
    this.category = 'Fun'
    this.description = 'Comando para transformar uma palavra em binário'
    this.usage = 'binary encode/decode'
    this.aliases = []

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!args) {
      message.reply(
        'Por favor especifique oque você quer codificar/decodificar',
      )
      return
    }

    const query = args.shift().toLowerCase()
    let word = args.join(' ')

    if (query === 'encode') {
      if (!word) {
        message.reply('Por favor especifique oque você quer codificar')
        return
      }
      const { data } = await axios.get(
        `https://some-random-api.ml/binary?text=${encodeURIComponent(word)}`,
      )

      message.reply(`\`\`\`${data.binary}\`\`\``)

      return
    }

    if (query === 'decode') {
      if (!word) {
        message.reply('Por favor especifique oque você quer decodificar')
        return
      }
      const { data } = await axios.get(
        `https://some-random-api.ml/binary?decode=${encodeURIComponent(word)}`,
      )

      message.reply(`\`\`\`${data.text}\`\`\``)

      return
    }

    message.reply('Não tenho essa função!')
  }
}
