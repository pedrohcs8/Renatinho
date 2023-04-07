const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Comando para iniciar uma votação de um tema')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((options) =>
      options
        .setName('tema')
        .setDescription('Coloque o tema da votação aqui.')
        .setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options } = interaction

    const question = options.getString('tema')

    const embed = new EmbedBuilder()
      .setDescription('**Pergunta:**\n' + question)
      .setImage('https://i.ibb.co/vxdBKFd/Untitled-1.gif')
      .addFields([
        {
          name: 'Sim',
          value: '0',
          inline: true,
        },
        {
          name: 'Não',
          value: '0',
          inline: true,
        },
      ])
      .setColor(process.env.EMBED_COLOR)

    const replyObj = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    })

    //Coisas da Vidannn - Miguel Dias 2023
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Sim')
        .setCustomId(`Poll-Yes-${replyObj.id}`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setLabel('Não')
        .setCustomId(`Poll-No-${replyObj.id}`)
        .setStyle(ButtonStyle.Danger)
    )

    interaction.editReply({ components: [buttons] })
  },
}
