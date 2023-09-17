const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')
const Utils = require('../../../util/Utils')

module.exports = {
  category: 'Economia',
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Veja os itens no seu inventário'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { member } = interaction

    const personData = await profileSchema.findOne({ userId: member.id })
    let ownerId

    if (personData.customshopitens.length <= 0) {
      const NoItemEmbed = new EmbedBuilder()
        .setColor(`${process.env.EMBED_COLOR}`)
        .setAuthor({ name: `${member.user.tag} - Itens` })
        .addFields({
          name: `**Itens comprados:**\n\n`,
          value: `Nenhum`,
        })

      return interaction.reply({ embeds: [NoItemEmbed] })
    }

    const products = personData.customshopitens
      .sort((a, b) => b.price - a.price)
      .map((itens) => {
        if (itens.size <= 0) {
          return
        }

        return `${itens.emoji} **${itens.name}** - ID: \`${
          itens.id
        }\`\nPreço: **${Utils.toAbbrev(
          itens.price
        )}** - Quantia que você tem: **\`${
          itens.size
        }\`**\nComprado na loja: **${itens.shopName}**`
      })
      .join(`\n\n`)

    console.log(products)

    const embed = new EmbedBuilder()
      .setColor(`${process.env.EMBED_COLOR}`)
      .setAuthor({ name: `${member.user.tag} - Itens` })
      .addFields({
        name: `**Itens comprados:**\n\n`,
        value: products.toString(),
      })

    interaction.reply({ embeds: [embed] })
  },
}
