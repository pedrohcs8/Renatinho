const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')
const economy = require('../../../features/features/economy')
const Util = require('../../../util/Utils')

module.exports = {
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Transfira dinheiro para alguém.')
    .addUserOption((options) =>
      options
        .setName('pessoa')
        .setDescription('Mencione de quem você transferir o dinheiro')
        .setRequired(true)
    )
    .addNumberOption((options) =>
      options
        .setName('quantidade')
        .setDescription('Quantia de dinheiro a ser mandada')
        .setRequired(true)
        .setMinValue(1)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { member, options } = interaction

    await interaction.deferReply()

    const money = options.getNumber('quantidade')
    const user = options.getUser('pessoa')

    const doc = await profileSchema.findOne({
      userId: member.id,
    })

    if (user.id === member.id)
      return interaction.reply(
        `${member}, você não pode enviar dinheiro para si mesmo.`
      )

    const coinsOwned = doc.bank

    if (money > coinsOwned)
      return interaction.reply(
        `${member}, você não tem esse dinheiro! Você só pode fazer transferências com o dinheiro no banco`
      )

    const row = new ActionRowBuilder()

    const yesButton = new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('Enviar')
      .setStyle(ButtonStyle.Success)
      .setDisabled(false)

    const noButton = new ButtonBuilder()
      .setCustomId('no')
      .setLabel('Cancela')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(false)

    row.addComponents([yesButton, noButton])

    const msg = await interaction.editReply({
      content: `${member}, você deseja enviar **RC${Util.toAbbrev(
        money
      )}** para o(a) ${user}?!`,
      components: [row],
    })

    let collect

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    })

    collector.on('collect', async (x) => {
      if (x.user.id == member.id) {
        collect = x

        switch (x.customId) {
          case 'yes': {
            interaction.channel.send(
              `${member}, renatocoins enviadas com sucesso.`
            )

            await economy.addBank(member.id, money * -1)

            await economy.addBank(user.id, money)

            msg.delete()
            break
          }
          case 'no': {
            msg.delete()

            return interaction.channel.send(
              `${member}, envio de dinheiro cancelado.`
            )
          }
        }
      }
    })

    collector.on('end', (x) => {
      if (collect) return
      //   x.update({ components: [] })
    })
  },
}
