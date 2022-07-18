//Sistema de depositar coins no banco

const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')

module.exports = class DepositCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'deposit'
    this.category = 'Economy'
    this.description = 'Comando para depositar suas renatocoins no banco'
    this.usage = 'deposit <quantidade>'
    this.aliases = ['depositar', 'dep']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    profileSchema.findOne({ userId: message.author.id }, async (err, user) => {
      const { guild, member } = message

      let coins = {}

      if (args[0] == 'all') {
        coins = user.coins
        message.reply(
          `Você depositou **${coins.toLocaleString()}** renatocoins em sua conta bancária`
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { coins: user.coins - coins } }
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { bank: user.bank + coins } }
        )
        return
      } else if (args[0] == 'tudo') {
        coins = user.coins
        message.reply(
          `Você depositou **${coins.toLocaleString()}** renatocoins em sua conta bancária`
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { coins: user.coins - coins } }
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { bank: user.bank + coins } }
        )
        return
      } else {
        coins = parseInt(args[0])
      }

      const doc = await profileSchema.findOne({userId: message.author.id})
      const coinsOwned = doc.coins

      if (!coins) {
        message.reply(`Você deve inserir a quantidade á ser depositada.`)
        return
      } else if (isNaN(coins)) {
        message.reply(`Você deve inserir uma quantidade de renatocoins válida.`)
        return
      } else if (coins > coinsOwned) {
        message.reply(`Você não tem **${coins}** para depositar`)
        return
      } else {
        message.reply(
          `Você depositou **${coins.toLocaleString()}** renatocoins em sua conta bancária`
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { coins: user.coins - coins } }
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { bank: user.bank + coins } }
        )
      }
    })
  }
}
