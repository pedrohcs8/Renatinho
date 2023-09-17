const {
  Client,
  StringSelectMenuInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const CommandHandler = require('../../Handlers/Commands')

const returnFromCommand = (interaction, category) => {
  const { helpArray } = CommandHandler
  const commands = helpArray.filter((x) => x.category == category)

  const embed = new EmbedBuilder()
    .setTitle(`Comandos De ${category}`)
    .setDescription(
      `${commands.map((x) => `**${capitalize(x.name)}\n**`).join(' ')}`
    )
    .setColor(process.env.EMBED_COLOR)

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('help_menu_command')
      .setPlaceholder('Escolha um Comando')
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        commands.map((command) => {
          return {
            label: `${capitalize(command.name)}`,
            value: `${command.name}`,
          }
        })
      )
  )

  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`help_return_home`)
      .setEmoji('↩️')
      .setLabel('RETORNAR')
      .setStyle(ButtonStyle.Primary)
  )

  return interaction.update({ embeds: [embed], components: [row, buttonRow] })
}

module.exports = {
  name: 'interactionCreate',

  /**
   *
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    if (
      !interaction.isStringSelectMenu ||
      interaction.customId !== 'help_menu_list'
    ) {
      return
    }

    const { helpArray } = CommandHandler
    const category = interaction.values
    const commands = helpArray.filter((x) => x.category == category)

    const embed = new EmbedBuilder()
      .setTitle(`Comandos De ${category}`)
      .setDescription(
        `${commands.map((x) => `**${capitalize(x.name)}\n**`).join(' ')}`
      )
      .setColor(process.env.EMBED_COLOR)

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('help_menu_command')
        .setPlaceholder('Escolha um Comando')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
          commands.map((command) => {
            return {
              label: `${capitalize(command.name)}`,
              value: `${command.name}`,
            }
          })
        )
    )
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`help_return_home`)
        .setEmoji('↩️')
        .setLabel('RETORNAR')
        .setStyle(ButtonStyle.Primary)
    )

    return interaction.update({ embeds: [embed], components: [row, buttonRow] })
  },
  returnFromCommand,
}

const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || ''
