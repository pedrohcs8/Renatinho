const Command = require('@util/structures/Command')
const economy = require('@features/economy')
const profileSchema = require('@schemas/profile-schema')

module.exports = class RestockCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'restock'
    this.category = 'Economy'
    this.description = 'Comando para re-estocar as prateleiras de sua loja'
    this.usage =
      'restock <id do item> <quantidade ( preço 10% menor do que o valor anunciado )>'
    this.aliases = ['re-estocar']
    this.reference = 'customshop'

    this.enabled = true
    this.guildOnly = true
    this.isSub = true
  }

  async run({ message, args, prefix, author }) {
    const User = message.author

    const { guild } = message

    const itens = await profileSchema
      .findOne({ userId: message.author.id })
      .then((x) => Object.entries(x.customshop.itens))

    if (!itens) {
      message.reply('Você não é dono de uma loja ou não tem nenhum item')
      return
    }

    const infoObject = itens.filter(([, x]) => x.id == parseInt(args[1]))

    if (!infoObject.length) {
      message.reply(`o item de ID: **${args[1]}** não existe!`)
      return
    }

    let find = infoObject[0][1]

    const size = !args[2] ? 10 : parseInt(args[2])
    console.log(size)

    const updateObject = infoObject.reduce(
      (o, [key]) =>
        Object.assign(o, {
          [`customshop.itens.${key}.price`]: find.price,
          [`customshop.itens.${key}.size`]: find.size + size,
          [`customshop.itens.${key}.id`]: find.id,
          [`customshop.itens.${key}.name`]: find.name,
          [`customshop.itens.${key}.emoji`]: find.emoji,
          [`customshop.itens.${key}.owner`]: message.author.id,
        }),
      {}
    )

    const percentage = 90

    const data = await profileSchema.findOne({userId: message.author.id})

    const money = (100 * size) / find.price

    if (data.coins < money) {
      message.reply("Você não tem esse dinheiro!")
      return
    }

    await economy.addCoins(guild.id, User.id, money * -1)

    await profileSchema.findOneAndUpdate({ userId: User.id }, updateObject)

    message.reply(
      `Você colocou ${size} itens do id ${args[1]} por ${money} renatocoins`
    )
  }
}
