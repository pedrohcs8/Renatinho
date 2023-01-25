const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require('discord.js')
const profileSchema = require('../../../../schemas/profile-schema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sobremim')
    .setDescription('Comando para mudar o sobremim do seu perfil')
    .addStringOption((options) =>
      options
        .setName('frase')
        .setDescription('A frase que estará no sobremim do seu profile')
        .setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, member } = interaction

    const frase = options.getString('frase')

    if (frase.length > 300) {
      return interaction.reply(
        'O sobremim não pode ter mais que 300 caracteres'
      )
    }

    await profileSchema.findOneAndUpdate(
      { userId: member.id },
      { $set: { about: frase } }
    )

    interaction.reply('Seu sobremim foi alterado com sucesso!')
  },
}
