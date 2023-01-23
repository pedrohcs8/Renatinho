const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('superspam')
    .setDescription('Spam de mensagens de cria')
    .setDMPermission(false)
    .addNumberOption((options) =>
      options
        .setName('quantidade')
        .setDescription('Quantidade de vezes que o bot vai spamar')
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption((options) =>
      options
        .setName('frase')
        .setDescription('O Texto que será spamado')
        .setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    await interaction.deferReply()

    const { options } = interaction

    const quantidade = options.getNumber('quantidade')
    const frase = options.getString('frase')

    console.log(frase)

    interaction.editReply({ content: 'Super spam has started!' })

    for (var i = 0; i < quantidade; i++) {
      console.log(i)
      interaction.channel.send({ content: frase }).then((x) => console.log(i--))
    }
  },
}
