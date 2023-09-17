const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js')

module.exports = {
  category: 'Informação',
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Comando para mandar a sua foto de perfil')
    .addMentionableOption((options) =>
      options
        .setName('membro')
        .setDescription('O membro que você quer ver o avatar')
        .setRequired(false)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options } = interaction

    const membro = options.getMentionable('membro')

    if (membro) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Avatar de ${membro.user.tag}` })
        .setImage(membro.displayAvatarURL({ size: 1024 }))
        .setColor(process.env.EMBED_COLOR)

      interaction.reply({ embeds: [embed] })
    } else {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Avatar de ${interaction.user.tag}` })
        .setImage(interaction.user.displayAvatarURL({ size: 1024 }))
        .setColor(process.env.EMBED_COLOR)

      interaction.reply({ embeds: [embed] })
    }
  },
}
