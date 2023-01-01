const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js')

const profileSchema = require('../../../schemas/profile-schema')
const economy = require('../../../features/features/economy')
const Utils = require('../../../util/Utils')
const { abbreviateNumber } = require('js-abbreviation-number')

module.exports = {
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('customshop')
    .setDescription('Cria e configura a loja customizada')
    .addSubcommand((options) =>
      options
        .setName('create')
        .setDescription('Cria a sua loja customizada')
        .addStringOption((options) =>
          options
            .setName('nome')
            .setDescription('Nome da sua loja customizada')
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('additem')
        .setDescription('Adiciona um item para a sua loja')
        .addNumberOption((options) =>
          options
            .setName('id')
            .setDescription('O id do produto')
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName('nome')
            .setDescription('Nome do produto')
            .setRequired(true)
        )
        .addNumberOption((options) =>
          options
            .setName('preço')
            .setDescription('O preço do produto')
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName('emoji')
            .setDescription(
              'O emoji que aparecerá na frente do nome do produto'
            )
        )
    )
    .addSubcommand((options) =>
      options.setName('delete').setDescription('Deleta sua loja')
    )
    .addSubcommand((options) =>
      options
        .setName('nome')
        .setDescription('Troca o nome da sua loja customizada')
        .addStringOption((options) =>
          options
            .setName('nome')
            .setDescription('O novo nome da sua loja')
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('removeitem')
        .setDescription('Remove um item da sua loja')
        .addNumberOption((options) =>
          options
            .setName('id')
            .setDescription('O id do produto')
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('restock')
        .setDescription('Re-estoca um item da sua loja')
        .addNumberOption((options) =>
          options.setName('id').setDescription('O id do item').setRequired(true)
        )
        .addNumberOption((options) =>
          options
            .setName('quantidade')
            .setDescription(
              'A quantidade de itens que você gostatia de colocar em estoque'
            )
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options.setName('warehouse').setDescription('Mostra os itens da sua loja')
    )
    .addSubcommand((options) =>
      options
        .setName('edititem')
        .setDescription('Edita um item da sua loja')
        .addNumberOption((options) =>
          options.setName('id').setDescription('O id do item').setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName('nome')
            .setDescription('O novo nome do produto')
            .setRequired(true)
        )
        .addNumberOption((options) =>
          options
            .setName('preço')
            .setDescription('O novo preço do produto')
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName('emoji')
            .setDescription('O emoji que aparece antes do preço do produto')
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { member, options } = interaction

    const data = await profileSchema.findOne({ userId: member.id })

    switch (options.getSubcommand()) {
      case 'create': {
        if (data.coins < 15000) {
          interaction.reply('Você não tem dinheiro para formar sua loja')
          return
        } else if (data.customshop.createShop) {
          interaction.reply('Você já tem uma loja')
          return
        }

        economy.addCoins(member.id, 15000 * -1)

        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          {
            $set: {
              'customshop.name': `${options.getString('nome')}`,
              'customshop.owner': member.id,
              'customshop.createShop': true,
            },
          }
        )

        interaction.reply('Loja formada com sucesso')
        break
      }

      case 'additem': {
        if (!data.customshop.createShop) {
          interaction.reply('Você não é dono de uma loja')
          return
        }

        const id = options.getNumber('id')
        const name = options.getString('nome')
        const price = options.getNumber('preço')
        let emoji = options.getString('emoji')

        if (!price > 100) {
          interaction.editReply(
            'O item deve custar pelo menos 100 renatocoins.'
          )
          return
        }

        if (emoji) {
          let regex =
            /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/

          if (!regex.test(emoji)) {
            return interaction.editReply('O que você colocou não é um emoji')
          } else if (emoji.length < 1) {
            return interaction.editReply('Você só pode colocar um emoji')
          }
        } else {
          emoji = ''
        }

        const updateObject = {
          id: `${id}`,
          size: 1,
          price: `${price}`,
          name: `${name}`,
          emoji: `${emoji}`,
        }

        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          {
            $push: {
              [`customshop.itens`]: updateObject,
            },
          }
        )

        interaction.reply('Item adicionado com sucesso')
        break
      }

      case 'delete': {
        if (!data.customshop.createShop) {
          interaction.editReply('Você não é dono de uma loja')
          return
        }

        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          {
            $set: {
              'customshop.name': ``,
              'customshop.owner': `null`,
              'customshop.createShop': false,
              'customshop.itens': [],
            },
          }
        )
        interaction.editReply('Loja demolida com sucesso')
        break
      }

      case 'nome': {
        if (!data.customshop.createShop) {
          interaction.editReply('Você não é dono de uma loja')
          return
        }
        const name = options.getString('nome')

        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          {
            $set: {
              'customshop.name': `${name}`,
              'customshop.owner': member.id,
              'customshop.createShop': true,
            },
          }
        )
        interaction.reply('Nome da loja alterado com sucesso')
        break
      }

      case 'removeitem': {
        const id = options.getNumber('id')

        if (!data.customshop.createShop) {
          interaction.editReply('Você não é dono de uma loja')
          return
        }

        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          { $pull: { 'customshop.itens': { id: id } } }
        )

        interaction.editReply('Item removido com sucesso')
        break
      }

      case 'restock': {
        interaction.deferReply()

        const id = options.getNumber('id')
        const size = options.getNumber('quantidade')

        const itens = await profileSchema
          .findOne({ userId: member.id })
          .then((x) => Object.entries(x.customshop.itens))

        if (!itens) {
          interaction.editReply(
            'Você não é dono de uma loja ou não tem nenhum item'
          )
          return
        }

        const infoObject = itens.filter(([, x]) => x.id == id)

        if (!infoObject.length) {
          interaction.editReply(`o item de ID: **${id}** não existe!`)
          return
        }

        let find = infoObject[0][1]

        const updateObject = infoObject.reduce(
          (o, [key]) =>
            Object.assign(o, {
              [`customshop.itens.${key}.price`]: find.price,
              [`customshop.itens.${key}.size`]: find.size + size,
              [`customshop.itens.${key}.id`]: find.id,
              [`customshop.itens.${key}.name`]: find.name,
              [`customshop.itens.${key}.emoji`]: find.emoji,
              [`customshop.itens.${key}.owner`]: member.id,
            }),
          {}
        )

        const data = await profileSchema.findOne({ userId: member.id })

        function percentage(partialValue, totalValue) {
          return (100 * partialValue) / totalValue
        }

        const money = percentage(20, find.price) * size

        if (data.coins < money) {
          interaction.editReply('Você não tem esse dinheiro!')
          return
        }

        await economy.addCoins(
          member.id,
          parseInt(money.toString().split('.')[0]) * -1
        )

        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          updateObject
        )

        interaction.editReply(
          `Você colocou ${size} itens do id **${id}** por **${
            money.toString().split('.')[0]
          }** renatocoins`
        )
        break
      }

      case 'warehouse': {
        await interaction.deferReply()

        const itens = await profileSchema
          .findOne({ userId: member.id })
          .then((x) => Object.entries(x.customshop.itens))

        if (!itens) {
          interaction.editReply(
            'Você não é dono de uma loja ou não tem nenhum item'
          )
          return
        }

        const user1 = await profileSchema
          .findOne({ userId: member.id })
          .then((x) => Object.entries(x.customshop.itens))

        const custom = user1.sort((x, f) => f[1].id + x[1].id)

        const EMBED = new EmbedBuilder()
          .setTitle('Itens no estoque')
          .setDescription(
            custom
              .map(
                ([_, value]) =>
                  `${value.emoji} **${
                    value.name.charAt(0).toUpperCase() + value.name.slice(1)
                  }** - ID: \`${value.id}\`\nPreço: **${Utils.toAbbrev(
                    value.price
                  )}** - Quantia em estoque: **\`${value.size}\`**`
              )
              .join('\n\n')
          )
          .setColor(`${process.env.EMBED_COLOR}`)

        interaction.editReply({ embeds: [EMBED] })
        break
      }

      case 'edititem':
        {
          const id = options.getNumber('id')
          const price = options.getNumber('preço')
          let emoji = options.getString('emoji')
          const name = options.getString('nome')

          if (emoji) {
            let regex =
              /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/

            if (!regex.test(emoji)) {
              return interaction.reply('O que você colocou não é um emoji')
            } else if (emoji.length < 1) {
              return interaction.reply('Você só pode colocar um emoji')
            }
          } else {
            emoji = ''
          }

          const itens = await profileSchema
            .findOne({ userId: member.id })
            .then((x) => Object.entries(x.customshop.itens))

          if (!itens) {
            interaction.reply(
              'Você não é dono de uma loja ou não tem nenhum item'
            )
            return
          }

          const infoObject = itens.filter(([, x]) => x.id == id)

          if (!infoObject.length) {
            interaction.editReply(`o item de ID: **${id}** não existe!`)
            return
          }

          let find = infoObject[0][1]

          const updateObject = infoObject.reduce(
            (o, [key]) =>
              Object.assign(o, {
                [`customshop.itens.${key}.price`]: price,
                [`customshop.itens.${key}.size`]: find.size,
                [`customshop.itens.${key}.id`]: id,
                [`customshop.itens.${key}.name`]: name,
                [`customshop.itens.${key}.emoji`]: emoji,
                [`customshop.itens.${key}.owner`]: member.id,
              }),
            {}
          )

          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            updateObject
          )

          return interaction.reply('Item editado com sucesso')
        }
        break
    }
  },
}
