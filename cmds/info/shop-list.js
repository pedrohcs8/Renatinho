const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')

module.exports = class ShopListCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'shoplist'
    this.category = 'Economy'
    this.description = 'Comando ver a lista de itens'
    this.usage = 'shoplist [@ do dono da loja]'
    this.aliases = ['shoplist', 'shopl']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const mention = message.mentions.users.first()

    const COINS = await require('mongoose')
      .connection.collection('profiles')
      .find({ 'customshop.createShop': { $eq: true } })
      .toArray()

   

    const coins = Object.entries(COINS).map(([, x]) => x.userId)

    const members = []

    await this.PUSH(coins, members)

    const coinsMap = members.map((x) => x).slice(0, 10)

    if (mention) {
      const data = await profileSchema.findOne({ userId: mention.id })

      const itens = await profileSchema
        .findOne({ userId: mention.id })
        .then((x) => Object.entries(x.customshop.itens))

      message.reply(
        `Lista dos item que tem na loja de ${
          data.customshop.name == 'null' ? mention : data.customshop.name
        }:\n\n${itens
          .map(([, x]) => x)
          .filter((x) => x != true)
          .map(
            (x) =>
              `> ID: **${x.id}** ( Nome: **${x.name}** )\n> Valor: **\`${x.price}\`**`
          )
          .join('\n\n')}`
      )
      return
    }

    const itens = await profileSchema
      .findOne({ userId: message.author.id })
      .then((x) => Object.entries(x.shop.itens))

    message.reply(
      `Lista dos item que tem em minha loja:\n\n${itens
        .map(([, x]) => x)
        .filter((x) => x != true)
        .map(
          (x) =>
            `> ID: **${x.id}** ( Nome: **${x.name}** )\n> Valor: **\`${x.price}\`**`
        )
        .join('\n\n')}\n\n Lojas que recomendo: ${coinsMap
        .map((x, f) => `\`${f + 1}º\` **\`${x.user.tag}\`**`)
        .join('\n\n')}`
    )
  }
  async PUSH(coins, members) {
    for (const member of coins) {
      const doc = await this.client.database.users.findOne({ userId: member })

      members.push({
        user: await this.client.users.fetch(member).then((user) => {
          return user
        }),
        coins: doc.coins + doc.bank,
      })
    }
  }
}
