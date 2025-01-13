const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js')

module.exports = {
  category: 'Informação',
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Comando para ver informações sobre o bot'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { user, guild } = interaction

    const embed = new EmbedBuilder()
      .setTitle('Meu nome é Renatinho e aqui tem um pouco da minha história!')
      .addFields(
        {
          name: 'Fui criado por:',
          value: `**pedrohcs8** (contate ele se achar algum bug ou contribua no repo!)`,
        },
        {
          name: 'Quando fui criado:',
          value: `Fui criado em um **sábado, dia ‎2‎ de ‎janeiro‎ de ‎2021, ás ‏‎00:36:28**.`,
        },
        {
          name: 'Porque fui criado:',
          value: `Fui criado inicialmente para um sistema de sugestões em um antigo servidor, mas ganhei várias outras features com o tempo.`,
        },
        {
          name: 'Updates:',
          value:
            'Sempre que possível meu criador me atuliza me deixando mais estável e útil! Confira todas as novidades no repo!',
        },
        {
          name: 'Open Source!',
          value:
            'Meu código fonte todo está presente em: https://github.com/pedrohcs8/Renatinho',
        }
      )
      .setColor(process.env.EMBED_COLOR)
      .setThumbnail('https://i.imgur.com/f6yrLEe.png')

    interaction.reply({ embeds: [embed] })
  },
}
