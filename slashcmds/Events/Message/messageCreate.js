const { Message, EmbedBuilder, Client } = require('discord.js')
const db = require('../../../schemas/afk-schema')

module.exports = {
  name: 'messageCreate',

  /**
   *
   * @param {Message} message
   * @param {Client} client
   */

  async execute(message, client) {
    const messages = message.content.toLowerCase()

    const channel = client.channels.cache.get(message.channel.id)

    if (messages === 'vai toma no cu') {
      channel.send('**Vai tu krl**')
    }

    if (messages === 'fodase') {
      channel.send('Fodase o karaleo.')
    }

    if (messages === 'vsfd') {
      channel.send('**Vai tu krl**')
    }

    if (messages === 'cala boca renato') {
      channel.send('**Cala tu**')
    }

    if (messages === 'cala boca') {
      channel.send('**Cala tu**')
    }
    if (messages === 'boa noite renatinho') {
      channel.send('Boa noite :)')
    }
    if (messages === 'bom dia renatinho') {
      channel.send('Bom dia :)')
    }
    if (messages === 'pao') {
      channel.send('Vini????????')
    }
    if (messages === 'pedro gay') {
      channel.send('Minha bola esquerda ele é totamente **H-E-T-E-R-O**!')
    }
    if (messages.toLocaleLowerCase() === 'macaquitos') {
      channel.send('Messi???!?!?!?!?!??!?!?!')
    }
    if (messages.toLocaleLowerCase() === 'craque neto') {
      channel.send('**Um monstro jogando bola**')
    }
    if (messages.toLocaleLowerCase() === 'maestro') {
      channel.send('**BOA TARRRRDE GENTI**')
    }
  },
}
