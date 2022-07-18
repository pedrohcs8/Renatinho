const Command = require('@util/structures/Command')
const fetch = require('node-fetch')

module.exports = class GifCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'gif'
    this.category = 'Misc'
    this.description = 'Comando para mandar um gif'
    this.usage = 'gif [palavra-chave]'
    this.aliases = ['gif']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    args.shift

    const search = args.join(' ')

    let keywords = ''

    if (search.length > 1) {
      keywords = search
    }

    let url = `https://g.tenor.com/v1/search?q=${keywords}&key=XGJ8K2KN5ETF`

    let response = await fetch(url)
    let json = await response.json()
    const index = Math.floor(Math.random() * json.results.length)

    message.reply(json.results[index].url)
  }
}

//	XGJ8K2KN5ETF
