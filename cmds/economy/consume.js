//Sistema de Lojinha!

const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')

module.exports = class ConsumeCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'consume'
    this.category = 'Economy'
    this.description = 'Comando para usar as coisas da lojinha'
    this.usage = 'consume <id do item> <quantidade>'
    this.aliases = ['consumir', 'tomar', 'comer']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const { guild, member } = message

    const mention = message.mentions.members.first()

    if (mention) {
      const itens2 = await profileSchema
        .findOne({ userId: message.author.id })
        .then((x) => Object.entries(x.customshopitens.itens))

      const infoObject2 = itens2.filter(([, x]) => x.id == parseInt(args[1]))

      let find2

      console.log(infoObject2)

      if (infoObject2[0]) {
        find2 = infoObject2[0][1]

      if (find2.size <= 0) {
        message.reply('Você não tem esse item')
        return
      }
     }



      const size = !args[2] ? 1 : parseInt(args[2])

      console.log(find2)

      if (!infoObject2.length) {
        message.reply(`o item de ID: **${args[0]}** não existe!`)
      }

      const updateObject = infoObject2.reduce(
        (o, [key]) =>
          Object.assign(o, {
            [`customshopitens.itens.${key}.price`]: find2.price,
            [`customshopitens.itens.${key}.size`]: find2.size - size,
            [`customshopitens.itens.${key}.id`]: find2.id,
            [`customshopitens.itens.${key}.name`]: find2.name,
            [`customshopitens.itens.${key}.emoji`]: find2.emoji,
            [`customshopitens.itens.${key}.owner`]: mention.id,
          }),
        {}
      )

      await profileSchema.findOneAndUpdate({ userId: message.author.id }, updateObject)

      message.reply(
        `Você consumiu com sucesso **${size}** item(s) do id **${find2.id}** por **${find2.price}** renatocoins da loja de ${mention}`
      )
      return
    }

    const itens = await profileSchema
      .findOne({ userId: message.author.id })
      .then((x) => Object.entries(x.shop.itens))

    const infoObject = itens.filter(([, x]) => x.id === parseInt(args[0]))
    if (!infoObject.length) {
      message.reply(`o item de ID: **${args[0]}** não existe!`)
      return
    }
    let find = infoObject[0][1]
    const size = !args[1] ? 1 : parseInt(args[1])

    const updateObject = infoObject.reduce(
      (o, [key]) =>
        Object.assign(o, {
          [`shop.itens.${key}.price`]: find.price,
          [`shop.itens.${key}.size`]: find.size + size * -1,
          [`shop.itens.${key}.id`]: find.id,
          [`shop.itens.${key}.name`]: find.name,
          [`shop.itens.${key}.emoji`]: find.emoji,
        }),
      {}
    )

    console.log(updateObject)
    console.log(infoObject)

    console.log(size, find.size)

    if (find.size < size) {
      message.reply('Você não tem esses itens')
      return
    }

    await economy.addCoins(guild.id, member.id, find.price * size * -1)

    await profileSchema.findOneAndUpdate(
      { userId: message.author.id },
      updateObject
    )

    message.reply(
      `Você consumiu com sucesso **${size}** item(s) do id **${find.id}**!`
    )
  }
}
