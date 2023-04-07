const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')
const Emojis = require('@util/Emojis')
const Utils = require('../../../util/Utils')

module.exports = {
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Mostra o dinheiro que você tem na sua conta')
    .addUserOption((options) =>
      options
        .setName('pessoa')
        .setDescription('Pessoa que você gostaria de ver o saldo')
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { member, options } = interaction

    const target = options.getUser('pessoa') || member.user

    const personData = await profileSchema.findOne({ userId: target.id })

    const coins = personData.coins
    const bank = personData.bank

    //Pega o pirocoptero do pai - Charles e Cauã 2022
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${target.tag} - RenatoCoins`,
        iconURL: target.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: `${Emojis.Coins} | Coins em mãos:`,
          value: Utils.toAbbrev(coins).toString(),
        },
        {
          name: `${Emojis.Bank} | Coins no Banco:`,
          value: Utils.toAbbrev(bank).toString(),
        },
        {
          name: `${Emojis.Economy} | Total:`,
          value: Utils.toAbbrev(coins + bank).toString(),
        }
      )
      .setThumbnail(
        target.displayAvatarURL({ dynamic: true, size: 2048, format: 'jpg' })
      )
      .setFooter({
        text: 'Você só pode usar o dinheiro em mãos para pagar/comprar algo!',
      })
      .setColor(process.env.EMBED_COLOR)

    interaction.reply({ embeds: [embed] })
  },
}
