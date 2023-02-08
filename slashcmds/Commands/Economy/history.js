const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')
const buttonPages = require('../../../util/pagination')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('Mostra seu historico de pagamentos'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { member } = interaction

    const doc = await profileSchema.findOne({ userId: member.id })

    const bankHistory = doc.buyingHistory.sort(function (a, b) {
      return a.date - b.date
    })

    let embeds = []
    let objects = []

    const maxObjectsPerEmbed = 8

    // Split the big array into smaller arrays
    const smallerArrays = []
    for (let i = 0; i < bankHistory.length; i += maxObjectsPerEmbed) {
      smallerArrays.push(bankHistory.slice(i, i + maxObjectsPerEmbed))
    }

    // Send each smaller array in a separate embed
    smallerArrays.forEach((smallArray) => {
      const embed = new EmbedBuilder()
        .setColor(process.env.EMBED_COLOR)
        .setAuthor({
          name: `Histórico de pagamentos de ${member.user.tag}`,
          iconURL: member.displayAvatarURL(),
        })

      smallArray.forEach((obj) => {
        objects.push(obj)
      })

      embed.addFields(
        ...objects.map((item) => ({
          name: `${item.title}`,
          value: `${item.price} renatocoins - ${item.date.toLocaleString()}`,
        }))
      )

      embeds.push(embed)
      objects = []
    })

    buttonPages(interaction, embeds, 60000)
  },
}
