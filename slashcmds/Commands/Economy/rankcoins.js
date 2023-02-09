const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')
const Utils = require('../../../util/Utils')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rankcoins')
    .setDescription('Comando para olhar o rank de renatocoins.'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const COINS = await require('mongoose')
      .connection.collection('profiles')
      .find({ bank: { $gt: 0 } })
      .toArray()

    const coins = Object.entries(COINS)
      .map(([, x]) => x.userId)
      .sort((x, f) => x.bank - f.bank)

    const members = []

    await this.PUSH(coins, members, client)

    const coinsMap = members
      .map((x) => x)
      .sort((x, f) => f.coins - x.coins)
      .slice(0, 10)

    const TOP = new EmbedBuilder()
      .setAuthor({ name: `Ranking Monetário` })
      .setDescription(
        coinsMap
          .map(
            (x, f) =>
              `\`${f + 1}º\` **\`${x.user.tag}\`** - **R$${Utils.toAbbrev(
                x.coins
              )}**\nID: \`${x.user.id}\``
          )
          .join('\n\n')
      )
    interaction.reply({ embeds: [TOP] })
  },

  async PUSH(coins, members, client) {
    for (const member of coins) {
      const doc = await profileSchema.findOne({ userId: member })

      members.push({
        user: await client.users.fetch(member).then((user) => {
          return user
        }),
        coins: doc.coins + doc.bank,
      })
    }
  },
}
