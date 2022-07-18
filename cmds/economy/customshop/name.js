const Command = require('@util/structures/Command')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = class CreateShop extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'name'
    this.category = 'Economy'
    this.description = 'Comando para mudar o nome de sua loja'
    this.usage = 'name <nome>'
    this.aliases = ['nome']
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

    await profileSchema.findOneAndUpdate(
      { userId: message.author.id },
      {
        $set: {
          'customshop.name': `${
            !args[0] ? 'null' : args.slice(1, args.length).join(' ')
          }`,
          'customshop.exp': 0,
          'customshop.level': 1,
          'customshop.nextLevel': 500,
          'customshop.owner': message.author.id,
          'customshop.createShop': true,
        },
      }
    )
    message.reply('Nome da loja alterado com sucesso')
  }
}
