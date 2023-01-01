const Command = require('@util/structures/Command')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = class CreateShop extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'delete'
    this.category = 'Economy'
    this.description = 'Comando para deletar sua loja'
    this.usage = ''
    this.aliases = ['remover']
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
          'customshop.name': `${!args[0] ? 'null' : args[0]}`,
          'customshop.exp': 0,
          'customshop.level': 1,
          'customshop.nextLevel': 500,
          'customshop.owner': message.author.id,
          'customshop.createShop': false,
          'customshop.itens': [],
        },
      }
    )
    message.reply('Loja demolida com sucesso')
  }
}
