const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  Events,
  StringSelectMenuBuilder,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = {
  memberId: '',
  category: 'Economia',
  data: new SlashCommandBuilder()
    .setName('consume')
    .setDescription('Comando para consumir os itens do seu inventário'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { member } = interaction

    this.memberId = member.id

    const personData = await profileSchema.findOne({ userId: member.id })

    let itensMenu = []

    console.log(personData.customshopitens.length)

    if (personData.customshopitens.length <= 0) {
      return interaction.reply({ content: 'Você não tem itens pra consumir' })
    }

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

    if (itensMenu.length <= 0) {
      return interaction.reply({ content: 'Você não tem itens pra consumir' })
    }

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('consume_command')
        .setPlaceholder('Selecione um Item')
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
