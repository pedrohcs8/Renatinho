//Comando para ver sua conta bancária

const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')
const Emojis = require('@util/Emojis')
const { MessageEmbed } = require('discord.js')
const Utils = require('../../util/Utils')

module.exports = class BalanceCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'bal'
    this.category = 'Economy'
    this.description = 'Comando para ver quantas renatocoins você tem'
    this.usage = 'bal [@ da pessoa]'
    this.aliases = ['atm', 'banco', 'saldo', 'sal', 'bank', 'money']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const target =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      message.author

    const guildId = message.guild.id
    const userId = target.id

    const results = await profileSchema.findOne({ userId: target.id })

    const coins = results.coins
    const bank = results.bank

    const embed = new MessageEmbed()
      .setAuthor(
        `${target.tag} - RenatoCoins`,
        target.displayAvatarURL({ dynamic: true })
      )
      .addFields(
        {
          name: `${Emojis.Coins} | Coins em mãos:`,
          value: Utils.toAbbrev(coins).toString(),
        },
        {
          name: `${Emojis.Bank} | Coins no Banco:`,
          value: Utils.toAbbrev(bank).toString(),
        },
        {
          name: `${Emojis.Economy} | Total:`,
          value: Utils.toAbbrev(coins + bank).toString(),
        }
      )
      .setThumbnail(
        target.displayAvatarURL({ dynamic: true, size: 2048, format: 'jpg' })
      )
      .setFooter(
        'Você só pode usar o dinheiro em mãos para pagar/comprar algo!'
      )
      .setColor(process.env.EMBED_COLOR)

    message.reply({ embeds: [embed] })
  }
}
