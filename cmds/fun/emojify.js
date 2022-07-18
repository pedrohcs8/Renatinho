const { MessageAttachment, MessageEmbed } = require('discord.js')
const Command = require('@util/structures/Command')

module.exports = class EmojifyCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'emojify'
    this.category = 'Fun'
    this.description = 'Comando para transformar uma frase em emojis'
    this.usage = 'emojify <texto>'
    this.aliases = ['emojificar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!args.length) {
      message.reply('Dê um texto para eu transformar em emojis.')
      return
    }

    const specialCodes = {
      0: ':zero:',
      1: ':one:',
      2: ':two:',
      3: ':three:',
      4: ':four:',
      5: ':five:',
      6: ':six:',
      7: ':seven:',
      8: ':eigtht:',
      9: ':nine:',
      '#': ':hash:',
      '*': ':asterisk:',
      '?': ':grey_question:',
      '!': ':grey_exclamation:',
      ' ': ' ',
    }
    const text = args
      .join(' ')
      .toLowerCase()
      .split('')
      .map((letter) => {
        if (/[a-z]/g.test(letter)) {
          return `:regional_indicator_${letter}:`
        } else if (specialCodes[letter]) {
          return `${specialCodes[letter]}`
        }
        return letter
      })
      .join(' ')

    message.channel.send(text)
  }
}
