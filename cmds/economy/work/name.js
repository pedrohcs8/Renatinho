const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')
const Utils = require('@util/Utils')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
require('moment-duration-format')

module.exports = class Name extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'name'
    this.category = 'Economy'
    this.description = 'Comando para mudar o nome de sua empresa'
    this.usage = ''
    this.aliases = ['information']
    this.reference = 'work'

    this.enabled = true
    this.guildOnly = true
    this.isSub = true
  }

  async run({ message, args, prefix, author }) {
    profileSchema.findOne({ userId: message.author.id }, async (err, user) => {
      const work = user.work
      let name = args.slice(1).join(' ')

      if (!name) {
        return message.reply(
          'Você deve mandar o nome á ser setado em sua empresa.'
        )
      } else if (name === work.name) {
        return message.reply('O nome inserido é igual ao atual')
      } else if (name.length > 25) {
        return message.reply(
          'O nome inserido é muito grande, tente novamente com 25 ou menos caracteres.'
        )
      } else {
        message.reply(
          `O nome de sua empresa foi alterado com sucesso para: ${name}!`
        )
        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          {
            $set: {
              'work.name': name,
            },
          }
        )
      }
    })
  }
}
