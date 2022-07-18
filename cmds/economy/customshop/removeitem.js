const Command = require('@util/structures/Command')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = class RemoveItem extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'removeitem'
    this.category = 'Economy'
    this.description = 'Comando para retirar um item de sua loja'
    this.usage = 'removeitem <Id do item>'
    this.aliases = ['']
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
      { $pull: { 'customshop.itens': { id: args[1] } } }
    )
    message.reply('Item removido com sucesso')
  }
}
