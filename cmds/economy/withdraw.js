const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')

module.exports = class WithDrawCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'withdraw'
    this.category = 'Economy'
    this.description = 'Comando para sacar suas renatocoins no banco'
    this.usage = 'withdraw <quantidade>'
    this.aliases = ['sacar', 'retirar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    profileSchema.findOne({ userId: message.author.id }, async (err, user) => {
      const { guild, member } = message

      let coins = {}

      const results = await profileSchema.findOne({ userId: message.author.id })

      if (args[0] == 'all') {
        coins = results.bank
        message.reply(
          `Você sacou **${coins.toLocaleString()}** renatocoins de sua conta bancária`
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { coins: user.coins + coins } }
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { bank: user.bank - coins } }
        )
        return
      } else if (args[0] == 'tudo') {
        coins = results.bank
        message.reply(
          `Você sacou **${coins.toLocaleString()}** renatocoins de sua conta bancária`
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { coins: user.coins + coins } }
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { bank: user.bank - coins } }
        )
        return
      } else {
        coins = parseInt(args[0])
      }

      let coinsOwned = results.bank

      if (coinsOwned == undefined) {
        coinsOwned = 0
      }

      if (!coins) {
        message.reply(`Você deve inserir a quantidade á ser sacada.`)
        return
      } else if (isNaN(coins)) {
        message.reply(`Você deve inserir uma quantidade de renatocoins válida.`)
        return
      } else if (coins > coinsOwned) {
        message.reply(`Você não tem **${coins}** para sacar`)
        return
      } else {
        message.reply(
          `Você sacou **${coins.toLocaleString()}** renatocoins de sua conta bancária`
        )

        await economy.addCoins(guild.id, message.author.id, coins)

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { bank: user.bank - coins } }
        )
      }
    })
  }
}
