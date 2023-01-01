//Sistema de daily de coins

const Command = require('@util/structures/Command')
const dailyRewardsSchema = require('@schemas/daily-rewards-schema')
const economy = require('@features/economy')

let claimedCache = []

const clearCache = () => {
  claimedCache = []
  setTimeout(clearCache, 1000 * 60 * 10) //10 minutos
}
clearCache()

module.exports = class DailyCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'daily'
    this.category = 'Economy'
    this.description = 'Comando para pegar sua recompensa'
    this.usage = 'daily'
    this.aliases = ['daily']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const { guild, member } = message
    const { id } = member

    if (claimedCache.includes(id)) {
      console.log('Retornando do cache')
      message.reply('Você já pegou suas recompensas diárias.')
      return
    }

    console.log('Procurando na Mongo')

    const obj = {
      guildId: guild.id,
      userId: id,
    }

    const guildId = guild.id
    const userId = id

    const coins = Math.floor(Math.random() * 5000) + 1

    const results = await dailyRewardsSchema.findOne(obj)

    console.log('Resultados Daily:', results)

    if (results) {
      const then = new Date(results.updatedAt).getTime()
      const now = new Date().getTime()

      const diffTime = Math.abs(now - then)
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 1) {
        claimedCache.push(id)

        message.reply('Você já pegou suas recompensas diárias.')
        return
      }
    }

    await dailyRewardsSchema.findOneAndUpdate(obj, obj, {
      upsert: true,
    })

    claimedCache.push(id)

    const newCoins = await economy.addCoins(guildId, userId, coins)

    message.reply(
      `Você pegou sua recompensa diária!`,
    )
  }
}
