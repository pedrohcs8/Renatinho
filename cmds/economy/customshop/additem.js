const Command = require('@util/structures/Command')
const { Emoji } = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = class AddItem extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'additem'
    this.category = 'Economy'
    this.description = 'Comando para adicionar itens a sua loja'
    this.usage = 'additem <preço> [emoji] <nome>'
    this.aliases = ['addi']
    this.reference = 'customshop'

    this.enabled = true
    this.guildOnly = true
    this.isSub = true
  }

  async run({ message, args, prefix, author }) {
    const data = await profileSchema.findOne({ userId: message.author.id })

    if (!data.customshop.createShop) {
      message.reply('Você não é dono de uma loja')
      return
    }

    const length = args.length

    let name
    const price = parseInt(args[1])
    let emoji = args[2]

    if (!price > 100) {
      message.reply('O item deve custar pelo menos 100 renatocoins.')
      return
    }

    console.log(args[2])

    let regex =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/

    if (!args[2].match(regex)) {
      emoji = ''
      name = args.slice(2, length).join(' ')
    } else {
      name = args.slice(3, length).join(' ')
    }

    let key

    if (data.customshop.itens) {
      key = Object.keys(data.customshop.itens).length + 1
    } else {
      key = 1
    }

    const updateObject = {
      id: `${key}`,
      size: 1,
      price: `${price}`,
      name: `${name}`,
      emoji: `${emoji}`,
    }

    await profileSchema.findOneAndUpdate(
      { userId: message.author.id },
      {
        $push: {
          [`customshop.itens`]: updateObject,
        },
      }
    )

    message.reply('Item adicionado com sucesso')
  }
}
