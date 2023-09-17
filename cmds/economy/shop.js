//Sistema de Lojinha!

const Command = require('@util/structures/Command')
const economy = require('@features/economy')
const profileSchema = require('../../schemas/profile-schema')

module.exports = class ShopCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'shop'
    this.category = 'Economy'
    this.description = 'Comando para comprar coisas na lojinha'
    this.usage = 'shop [@ do dono da loja] <id do item> <quantidade>'
    this.aliases = ['shop', 'shop buy', 'buy']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const { guild, member } = message

    const User = message.author

    const mention = message.mentions.members.first()

    if (message.mentions.members.first()) {
      const itens = await profileSchema
        .findOne({ userId: mention.id })
        .then((x) => Object.entries(x.customshop.itens))

      if (!itens) {
        message.reply('Este usuário não tem uma loja')
        return
      }

      const infoObject = itens.filter(([, x]) => x.id == parseInt(args[1]))

      if (!infoObject.length) {
        message.reply(
          `o item de ID: **${
            args[1]
          }** não existe! Lista dos item que tem em minha loja.\n\n${itens
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
      let find = infoObject[0][1]
      const size = !args[2] ? 1 : parseInt(args[2])

      const doc = await profileSchema.findOne({ userId: message.author.id })
      const coinsOwned = doc.coins

      if (find.price * size > coinsOwned) {
        message.reply(
          'Você não tem dinheiro suficiente para comprar esse item.'
        )
        return
      } else {
        const itens = await profileSchema
          .findOne({ userId: mention.id })
          .then((x) => Object.entries(x.customshop.itens))

        const itens2 = await profileSchema
          .findOne({ userId: message.author.id })
          .then((x) => Object.entries(x.customshopitens.itens))

        let find = infoObject[0][1]

        const infoObject2 = itens2.filter(
          ([, x]) => x.id == parseInt(args[1]) && x.owner == find.owner
        )

        if (!itens) {
          message.reply('Este usuário não tem uma loja')
          return
        }

        if (find.size <= 0) {
          message.reply('Este item está em falta, peça para o dono re-estocar.')
          return
        }

        let find2

        console.log(infoObject2)

        if (infoObject2[0]) {
          find2 = infoObject2[0][1]
        }

        const size = !args[2] ? 1 : parseInt(args[2])

        console.log(find2)

        if (infoObject2.length) {
          const updateObject = infoObject2.reduce(
            (o, [key]) =>
              Object.assign(o, {
                [`customshopitens.itens.${key}.price`]: find2.price,
                [`customshopitens.itens.${key}.size`]: find2.size + size,
                [`customshopitens.itens.${key}.id`]: find2.id,
                [`customshopitens.itens.${key}.name`]: find2.name,
                [`customshopitens.itens.${key}.emoji`]: find2.emoji,
                [`customshopitens.itens.${key}.owner`]: mention.id,
              }),
            {}
          )

          const shopObject = infoObject2.reduce(
            (o, [key]) =>
              Object.assign(o, {
                [`customshop.itens.${key}.price`]: find.price,
                [`customshop.itens.${key}.size`]: find.size - size,
                [`customshop.itens.${key}.id`]: find.id,
                [`customshop.itens.${key}.name`]: find.name,
                [`customshop.itens.${key}.emoji`]: find.emoji,
                [`customshop.itens.${key}.owner`]: mention.id,
              }),
            {}
          )

          await economy.addCoins(guild.id, User.id, find.price * size * -1)

          await economy.addCoins(guild.id, mention.id, find.price * size)

          await profileSchema.findOneAndUpdate(
            { userId: User.id },
            updateObject
          )

          await profileSchema.findOneAndUpdate(
            { userId: mention.id },
            shopObject
          )

          message.reply(
            `Você comprou com sucesso **${size}** item(s) do id **${find.id}** por **${find.price}** renatocoins da loja de ${mention}`
          )

          return
        }

        const updateObject = {
          name: find.name,
          size: find.size + size,
          emoji: find.emoji,
          id: find.id,
          price: find.price,
          owner: mention.id,
        }

        await economy.addCoins(guild.id, User.id, find.price * size * -1)

        await economy.addCoins(guild.id, mention.id, find.price * size)

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $push: { 'customshopitens.itens': updateObject } }
        )

        const shopObject = infoObject2.reduce(
          (o, [key]) =>
            Object.assign(o, {
              [`customshop.itens.${key}.price`]: find.price,
              [`customshop.itens.${key}.size`]: find.size - size,
              [`customshop.itens.${key}.id`]: find.id,
              [`customshop.itens.${key}.name`]: find.name,
              [`customshop.itens.${key}.emoji`]: find.emoji,
              [`customshop.itens.${key}.owner`]: mention.id,
            }),
          {}
        )

        await profileSchema.findOneAndUpdate({ userId: mention.id }, shopObject)

        message.reply(
          `Você comprou com sucesso **${size}** item(s) do id **${find.id}** por **${find.price}** renatocoins da loja de ${mention}`
        )

        return
      }
    }

    const itens = await profileSchema
      .findOne({ userId: User.id })
      .then((x) => Object.entries(x.shop.itens))

    const infoObject = itens.filter(([, x]) => x.id === parseInt(args[0]))
    if (!infoObject.length) {
      message.reply(
        `o item de ID: **${
          args[0]
        }** não existe! Lista dos item que tem em minha loja.\n\n${itens
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
    let find = infoObject[0][1]
    const size = !args[1] ? 1 : parseInt(args[1])

    const doc = await profileSchema.findOne({ userId: message.author.id })
    const coinsOwned = doc.coins

    console.log(doc.bank)

    if (find.price * size > coinsOwned) {
      message.reply('Você não tem dinheiro suficiente para comprar esse item.')
      return
    } else {
      const updateObject = infoObject.reduce(
        (o, [key]) =>
          Object.assign(o, {
            [`shop.itens.${key}.price`]: find.price,
            [`shop.itens.${key}.size`]: find.size + size,
            [`shop.itens.${key}.id`]: find.id,
            [`shop.itens.${key}.name`]: find.name,
            [`shop.itens.${key}.emoji`]: find.emoji,
          }),
        {}
      )

      await economy.addCoins(guild.id, User.id, find.price * size * -1)

      await profileSchema.findOneAndUpdate({ userId: User.id }, updateObject)

      message.reply(
        `Você comprou com sucesso **${size}** item(s) do id **${find.id}** por **${find.price}** renatocoins`
      )
    }
  }
}
