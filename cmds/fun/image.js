//Manda uma foto de meu pc
const Command = require('@util/structures/Command')
const { MessageAttachment } = require('discord.js')
const fs = require('fs')
const path = require('path')

module.exports = class ImageCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'imagem'
    this.category = 'Misc'
    this.description = 'Comando para mandar uma imagem do pc do meu criador'
    this.usage = 'imagem'
    this.aliases = ['imagem']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const file = new MessageAttachment('', 'https://i.imgur.com/Maaq5PY.jpg')

    message.channel.send('Uma simples imagem do setup do meu criador', {
      files: [file],
    })
  }
}
//IMG_20210702_201820.jpg
