const Command = require('@util/structures/Command')
const AmongUsCategorySchema = require('@schemas/among-us-category-schema')

module.exports = class AmongUSCategoryCommmand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'aucat'
    this.category = 'Moderation'
    this.description = 'Comando setar a categoria para canais de among us'
    this.usage = 'aucat [id da categoria]'
    this.aliases = ['aucat']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }
    const categoryId = args
    if (!categoryId) {
      message.reply('Por favor especifique o ID de uma categoria.')
      return
    }

    const guildId = message.guild.id

    await AmongUsCategorySchema.findOneAndUpdate(
      {
        _id: guildId,
      },
      {
        _id: guildId,
        categoryId,
      },
      {
        upsert: true,
      },
    )

    message.reply('Categoria Among Us setada!')
  }
}
