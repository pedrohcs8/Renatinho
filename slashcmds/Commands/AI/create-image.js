const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
} = require('discord.js')
const { Configuration, OpenAIApi } = require('openai')
const openai = require('openai')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-image')
    .setDescription('Crie uma imagem com inteligência artificial!')
    .addStringOption((options) =>
      options
        .setName('tema')
        .setDescription('Qual o tema para a IA gerar a imagem')
        .setRequired(true)
        .setMaxLength(120)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    await interaction.deferReply({})

    const { options } = interaction

    const prompt = options.getString('tema')

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)

    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    })

    const image_url = response.data.data[0].url

    const attachment = new AttachmentBuilder(`${image_url}`, {
      name: 'image.jpg',
    })

    interaction.editReply({
      content: `\`${prompt}\``,
      files: [attachment],
    })
  },
}
