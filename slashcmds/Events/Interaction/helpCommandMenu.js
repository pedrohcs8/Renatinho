const {
  StringSelectMenuInteraction,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const CommandHandler = require('../../Handlers/Commands')

module.exports = {
  name: 'interactionCreate',

  /**
   *
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    if (
      !interaction.isStringSelectMenu() ||
      interaction.customId !== 'help_menu_command'
    ) {
      return
    }

    const { helpArray } = CommandHandler
    const selectedCommand = interaction.values[0]
    const commandObj = helpArray.filter((x) => x.name == selectedCommand)[0]

    const embed = new EmbedBuilder()
      .setTitle(`Comando ${capitalize(selectedCommand)}`)
      .setDescription(
        `**Categoria: ${commandObj.category}**\n\n${commandObj.description}`
      )
      // .addFields({
      //   name: `Categoria: ${commandObj.category}`,
      //   value: `${commandObj.description}`,
      // })
      .setColor(process.env.EMBED_COLOR)

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`help_return_category_${commandObj.category}`)
        .setEmoji('↩️')
        .setLabel('RETORNAR')
        .setStyle(ButtonStyle.Primary)
    )

    interaction.update({ embeds: [embed], components: [row] })
  },
}

const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || ''
