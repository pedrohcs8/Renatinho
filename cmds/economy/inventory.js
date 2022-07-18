//Sistema de Inventário

const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')
const Utils = require('@util/Utils')
const { MessageEmbed } = require('discord.js')
const ClientEmbed = require('../../util/structures/ClientEmbed')

module.exports = class InventoryCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'inventory'
    this.category = 'Economy'
    this.description = 'Comando ver seu inventário'
    this.usage = 'inventory'
    this.aliases = ['inv', 'inventory']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const User = message.author

      console.log(User.id)

      const user = await profileSchema
        .findOne({ userId: User.id })
        .then((x) => Object.entries(x.shop.itens))

      const user1 = await profileSchema
        .findOne({ userId: User.id })
        .then((x) => Object.entries(x.customshopitens.itens))

      if (!user1.length) {
        const user = await profileSchema
        .findOne({ userId: User.id })
        .then((x) => Object.entries(x.shop.itens))

        const list = user.filter(([, x]) => x.size > 0)

        const test = list.sort((x, f) => f[1].price - x[1].price)

        const EMBED = new ClientEmbed(author)
        .setDescription(
          test
            .map(
              ([_, value]) =>
                `${value.emoji} **${value.name}** - ID: \`${
                  value.id
                }\`\nPreço: **${Utils.toAbbrev(
                  value.price
                )}** - Quantia que você tem: **\`${value.size}\`**`
            )
            .join('\n\n')
        )
        .setColor(`${process.env.EMBED_COLOR}`)
        message.reply({ embeds: [EMBED] })
        return
    }

      const list = user.filter(([, x]) => x.size > 0)

      const test = list.sort((x, f) => f[1].price - x[1].price)

      const listcustom = user1.filter(([, x]) => x.size > 0)

      const custom = listcustom.sort((x, f) => f[1].price - x[1].price)

      const EMBED = new ClientEmbed(author)
        .setDescription(
          test
            .map(
              ([_, value]) =>
                `${value.emoji} **${value.name}** - ID: \`${
                  value.id
                }\`\nPreço: **${Utils.toAbbrev(
                  value.price
                )}** - Quantia que você tem: **\`${value.size}\`**`
            )
            .join('\n\n')
        )
        .setColor(`${process.env.EMBED_COLOR}`)
        .addFields({
          name: `Itens comprados em outras lojas:\n\n`,
          value: custom
            .map(
              ([_, value]) =>
                `${value.emoji} **${value.name}** - ID: \`${
                  value.id
                }\`\nPreço: **${Utils.toAbbrev(
                  value.price
                )}** - Quantia que você tem: **\`${
                  value.size
                }\`**\nComprado na loja de: **${
                  this.client.users.cache.get(value.owner).tag
                }**`
            )
            .join('\n\n'),
        })

      message.reply({ embeds: [EMBED] })
  }
}
