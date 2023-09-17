const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = {
  subsincluded: true,
  category: 'Economia',
  data: new SlashCommandBuilder()
    .setName('depositar')
    .setDescription('Comando para depositar seus renatocoins do banco')
    .addSubcommand((options) =>
      options
        .setName('tudo')
        .setDescription(
          'Deposita todos os renatocoins da sua carteira para o banco'
        )
    )
    .addSubcommand((options) =>
      options
        .setName('quantidade')
        .setDescription('Deposita uma certa quantia de renatocoins')
        .addNumberOption((options) =>
          options
            .setName('quantidade')
            .setDescription('Quantidade de renatocoins à ser depositada')
            .setRequired(true)
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { member, options } = interaction

    const doc = await profileSchema.findOne({ userId: member.id })
    const coinsOwned = doc.coins

    switch (options.getSubcommand()) {
      case 'tudo': {
        interaction.reply(
          `Você depositou **${doc.coins.toLocaleString()}** renatocoins em sua conta bancária`
        )

        //Tirar as coins da carteira
        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          { $set: { coins: doc.coins - doc.coins } }
        )

        //Colocar as coins no banco
        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          { $set: { bank: doc.bank + doc.coins } }
        )
        break
      }
      case 'quantidade': {
        const coins = options.getNumber('quantidade')

        if (coins > coinsOwned) {
          interaction.reply(`Você não tem **${coins}** para depositar`)
          return
        } else {
          interaction.reply(
            `Você depositou **${coins.toLocaleString()}** renatocoins em sua conta bancária`
          )

          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            { $set: { coins: doc.coins - coins } }
          )

          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            { $set: { bank: doc.bank + coins } }
          )
        }
      }
    }
  },
}
