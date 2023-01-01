const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = {
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('sacar')
    .setDescription('Comando para sacar seus renatocoins do banco')
    .addSubcommand((options) =>
      options
        .setName('tudo')
        .setDescription(
          'Saca todos os renatocoins do banco para a sua carteira'
        )
    )
    .addSubcommand((options) =>
      options
        .setName('quantidade')
        .setDescription('Saca uma certa quantia de renatocoins')
        .addNumberOption((options) =>
          options
            .setName('quantidade')
            .setDescription('Quantidade de renatocoins à ser sacada')
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

    const bankOwned = doc.bank

    switch (options.getSubcommand()) {
      case 'tudo': {
        interaction.reply(
          `Você sacou **${doc.bank.toLocaleString()}** renatocoins em sua conta bancária`
        )

        //Colocar as coins na carteira
        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          { $set: { coins: doc.coins + doc.bank } }
        )

        //Tirar as coins do banco
        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          { $set: { bank: doc.bank - doc.bank } }
        )
        break
      }
      case 'quantidade': {
        const coins = options.getNumber('quantidade')

        if (coins > bankOwned) {
          interaction.reply(`Você não tem **${coins}** para sacar`)
          return
        } else {
          interaction.reply(
            `Você sacou **${coins.toLocaleString()}** renatocoins em sua conta bancária`
          )

          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            { $set: { coins: doc.coins + coins } }
          )

          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            { $set: { bank: doc.bank - coins } }
          )
        }
      }
    }
  },
}
