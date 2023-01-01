//Manda uma foto de gatinho pela api
const Command = require('@util/structures/Command')
const axios = require('axios')

module.exports = class CatCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'gato'
    this.category = 'Misc'
    this.description = 'Comando para mandar a foto de um gatinho'
    this.usage = 'gato'
    this.aliases = ['gato', 'cat']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    axios
      .get('https://api.thecatapi.com/v1/images/search')
      .then((res) => {
        console.log('Resultado', res.data[0].url)
        message.reply(res.data[0].url)
      })
      .catch((err) => {
        console.log('Erro axios', err)
      })
  }
}
