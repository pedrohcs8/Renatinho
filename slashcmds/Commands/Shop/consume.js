const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  Events,
  StringSelectMenuBuilder,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('consume')
    .setDescription('Comando para consumir os itens do seu inventário'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { member } = interaction

    const personData = await profileSchema.findOne({ userId: member.id })

    let itensMenu = []

    personData.customshopitens.forEach((item) => {
      const obj = {
        name: item.name,
        shopName: item.shopName,
        id: item.id,
        owner: item.owner,
      }

      if (item.size <= 0) {
        return
      }

      itensMenu.push(obj)
    })

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select')
        .setPlaceholder('Nothing selected')
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(
          itensMenu.map((item) => {
            return {
              label: `${item.name}`,
              description: `Produto da loja ${item.shopName}`,
              value: `${item.id}-${item.owner}`,
            }
          })
        )
    )

    interaction.reply({ components: [row] })
  },
}
