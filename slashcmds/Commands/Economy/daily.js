const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require('discord.js')
const dailyRewardsSchema = require('../../../schemas/daily-rewards-schema')
const economy = require('@features/economy')

let claimedCache = []

const clearCache = () => {
  claimedCache = []
  setTimeout(clearCache, 1000 * 60 * 10) //10 minutos
}
clearCache()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Resgate sua recompensa diária'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    await interaction.deferReply()

    const { guild, member } = interaction

    if (claimedCache.includes(member.id)) {
      console.log('Retornando do cache')
      interaction.editReply('Você já pegou suas recompensas diárias.')
      return
    }

    const obj = {
      guildId: guild.id,
      userId: member.id,
    }

    const userId = member.id

    const coins = Math.floor(Math.random() * 5000) + 1

    const results = await dailyRewardsSchema.findOne(obj)

    if (results) {
      const then = new Date(results.updatedAt).getTime()
      const now = new Date().getTime()

      const diffTime = Math.abs(now - then)
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 1) {
        claimedCache.push(member.id)

        interaction.editReply('Você já pegou suas recompensas diárias.')
        return
      }
    }

    await dailyRewardsSchema.findOneAndUpdate(obj, obj)

    claimedCache.push(member.id)

    await economy.addCoins(userId, coins)

    interaction.editReply(`Você pegou sua recompensa diária!`)
  },
}
