const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')
const economy = require('../../../features/features/economy')

module.exports = {
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Compre coisas da lojinha do bot!')
    .addUserOption((options) =>
      options
        .setName('vendedor')
        .setDescription('Mencione de quem você quer comprar o produto aqui')
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('id')
        .setDescription('Id do item que você quer comprar')
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('quantidade')
        .setDescription('Quantos items você quer comprar')
        .setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, member } = interaction

    interaction.deferReply()

    const mention = options.getUser('vendedor')
    const size = !options.getNumber('quantidade')
      ? 1
      : options.getNumber('quantidade')
    const id = options.getNumber('id')

    // ---------------------- Objetos dos itens na database ----------------------

    const seller = await profileSchema.findOne({ userId: mention.id })

    const selleritens = await profileSchema
      .findOne({ userId: mention.id })
      .then((x) => Object.entries(x.customshop.itens))

    if (!selleritens) {
      interaction.editReply('Este usuário não tem uma loja')
      return
    }

    const sellerproductsobj = selleritens.filter(([, x]) => x.id == id)

    let sellerproducts = sellerproductsobj[0][1]

    //---------------------- Objeto dos Itens na conta da pessoa ----------------------

    const customeritens = await profileSchema
      .findOne({ userId: member.id })
      .then((x) => Object.entries(x.customshopitens))

    const itensininventoryobj = customeritens.filter(
      ([, x]) => x.id == id && x.owner == sellerproducts.owner
    )

    let itensininventory

    console.log(itensininventoryobj)

    if (itensininventoryobj[0]) {
      itensininventory = itensininventoryobj[0][1]
    }

    //---------------------- Fim dos objetos ----------------------

    // Renatocoins
    const doc = await profileSchema.findOne({ userId: member.id })
    const coinsOwned = doc.coins

    if (sellerproducts.price * size > coinsOwned) {
      interaction.editReply(
        'Você não tem dinheiro suficiente para comprar esse item.'
      )
      return
    } else {
      if (!selleritens) {
        interaction.editReply('Este usuário não tem uma loja')
        return
      }

      if (sellerproducts.size <= 0) {
        interaction.editReply(
          'Este item está em falta, peça para o dono re-estocar.'
        )
        return
      }

      if (itensininventoryobj.length) {
        //---------------------- Se houver documento ----------------------

        //Objeto do comprador
        const updateObject = itensininventoryobj.reduce(
          (o, [key]) =>
            Object.assign(o, {
              [`customshopitens.${key}.price`]: itensininventory.price,
              [`customshopitens.${key}.size`]: itensininventory.size + size,
              [`customshopitens.${key}.id`]: itensininventory.id,
              [`customshopitens.${key}.name`]: itensininventory.name,
              [`customshopitens.${key}.emoji`]: itensininventory.emoji,
              [`customshopitens.${key}.owner`]: mention.id,
              [`customshopitens.${key}.shopName`]: seller.customshop.name,
            }),
          {}
        )

        //Objeto do vendedor
        const shopObject = itensininventoryobj.reduce(
          (o, [key]) =>
            Object.assign(o, {
              [`customshop.itens.${key}.price`]: sellerproducts.price,
              [`customshop.itens.${key}.size`]: sellerproducts.size - size,
              [`customshop.itens.${key}.id`]: sellerproducts.id,
              [`customshop.itens.${key}.name`]: sellerproducts.name,
              [`customshop.itens.${key}.emoji`]: sellerproducts.emoji,
              [`customshop.itens.${key}.owner`]: mention.id,
              [`customshopitens.${key}.shopName`]: seller.customshop.name,
            }),
          {}
        )

        const productPriceWithMargin = sellingPrice(sellerproducts.price)

        //Tira o dinheiro da conta do comprador
        await economy.addCoins(member.id, productPriceWithMargin * size * -1)

        //Adiciona o dinheiro na conta do vendedor
        await economy.addCoins(mention.id, productPriceWithMargin * size)

        //Atualiza os objetos na conta do vendedor e do consumidor
        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          updateObject
        )
        await profileSchema.findOneAndUpdate({ userId: mention.id }, shopObject)

        let date = new Date()

        //Coloca no historico de compras
        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          {
            $push: {
              buyingHistory: {
                title: 'Compra de produto',
                price: productPriceWithMargin,
                date: date,
              },
            },
          }
        )

        interaction.editReply(
          `Você comprou com sucesso **${size}** item(s) do id **${sellerproducts.id}** por **${productPriceWithMargin}** renatocoins da loja de ${mention}`
        )

        //---------------------- Fim do IF ----------------------
      } else {
        //Objeto do comprador
        const updateObject = {
          name: sellerproducts.name,
          size: size,
          emoji: sellerproducts.emoji,
          id: sellerproducts.id,
          price: sellerproducts.price,
          owner: mention.id,
          shopName: seller.customshop.name,
        }

        //Objeto do vendedor
        const shopObject = itensininventoryobj.reduce(
          (o, [key]) =>
            Object.assign(o, {
              [`customshop.itens.${key}.price`]: sellerproducts.price,
              [`customshop.itens.${key}.size`]: sellerproducts.size - size,
              [`customshop.itens.${key}.id`]: sellerproducts.id,
              [`customshop.itens.${key}.name`]: sellerproducts.name,
              [`customshop.itens.${key}.emoji`]: sellerproducts.emoji,
              [`customshop.itens.${key}.owner`]: mention.id,
              [`customshopitens.${key}.shopName`]: seller.customshop.name,
            }),
          {}
        )

        const productPriceWithMargin = sellingPrice(sellerproducts.price)

        //Tira o dinheiro da conta do comprador
        await economy.addCoins(member.id, productPriceWithMargin * size * -1)

        //Bota o dinheiro na conta do vendedor
        await economy.addCoins(mention.id, productPriceWithMargin * size)

        // Atualiza os itens nas contas do vendedor e do consumidor
        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          { $push: { customshopitens: updateObject } }
        )

        await profileSchema.findOneAndUpdate({ userId: mention.id }, shopObject)

        let date = new Date()

        //Coloca no historico de compras
        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          {
            $push: {
              buyingHistory: {
                title: 'Compra de produto',
                price: productPriceWithMargin,
                date: date,
              },
            },
          }
        )

        interaction.editReply(
          `Você comprou com sucesso **${size}** item(s) do id **${sellerproducts.id}** por **${sellerproducts.price}** renatocoins da loja de ${mention}`
        )
      }
    }
  },
}

function sellingPrice(costPrice) {
  const num = costPrice + costPrice * 0.2
  return Math.ceil(num)
}
