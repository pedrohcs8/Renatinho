const Command = require('@util/structures/Command')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = class CreateShop extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'create'
    this.category = 'Economy'
    this.description = 'Comando para criar sua loja'
    this.usage = 'createshop [nome]'
    this.aliases = ['createshop']
    this.reference = 'customshop'

    this.enabled = true
    this.guildOnly = true
    this.isSub = true
  }

  async run({ message, args, prefix, author }) {
    const data = await profileSchema.findOne({ userId: message.author.id })
    const coins = 15000

    if (data.coins < coins) {
      message.reply('Você não tem dinheiro para formar sua loja')
      return
    } else if (data.customshop.createShop) {
      message.reply('Você já tem uma loja')
    }

    await profileSchema.findOneAndUpdate(
      { userId: message.author.id },
      { set: { coins: data.coins - coins } }
    )

    await profileSchema.findOneAndUpdate(
      { userId: message.author.id },
      {
        $set: {
          'customshop.name': `${!args[1] ? 'null' : args[1]}`,
          'customshop.exp': 0,
          'customshop.level': 1,
          'customshop.nextLevel': 500,
          'customshop.owner': message.author.id,
          'customshop.createShop': true,
        },
      }
    )
    message.reply('Loja formada com sucesso')
  }
}
