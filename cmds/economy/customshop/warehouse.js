//Sistema de Deposit da looja

const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')
const Utils = require('@util/Utils')
const { MessageEmbed } = require('discord.js')
const ClientEmbed = require('../../../util/structures/ClientEmbed')

module.exports = class WarehouseCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'warehouse'
    this.category = 'Economy'
    this.description = 'Comando ver o depósito de sua loja'
    this.usage = 'warehouse'
    this.aliases = ['deposito', 'depósito']
    this.reference = 'customshop'

    this.enabled = true
    this.guildOnly = true
    this.isSub = true
  }

  async run({ message, args, prefix, author }) {
    const User = message.author

    const itens = await profileSchema
      .findOne({ userId: message.author.id })
      .then((x) => Object.entries(x.customshop.itens))

    if (!itens) {
      message.reply('Você não é dono de uma loja ou não tem nenhum item')
      return
    }

    const user1 = await profileSchema
      .findOne({ userId: User.id })
      .then((x) => Object.entries(x.customshop.itens))

    const custom = user1.sort((x, f) => f[1].price - x[1].price)

    const EMBED = new ClientEmbed(author)
      .setTitle('Itens no estoque')
      .setDescription(
        custom
          .map(
            ([_, value]) =>
              `${value.emoji} **${value.name}** - ID: \`${
                value.id
              }\`\nPreço: **${Utils.toAbbrev(
                value.price
              )}** - Quantia em estoque: **\`${value.size}\`**`
          )
          .join('\n\n')
      )
      .setColor(`${process.env.EMBED_COLOR}`)

    message.reply({ embeds: [EMBED] })
  }
}
