const {
  ChatInputCommandInteraction,
  StringSelectMenuInteraction,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = {
  name: 'interactionCreate',
  /**
   *
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isStringSelectMenu()) {
      return
    }

    if (interaction.customId !== 'consume_command') {
      return
    }

    const { memberId } = require('../../Commands/Shop/consume')

    if (interaction.member.id !== memberId) {
      return interaction.reply({
        content: 'Você não tem permissão para usar esse menu',
        ephemeral: true,
      })
    }

    const menuChoice = interaction.values[0].split('-', 2)
    const productId = menuChoice[0]
    const ownerId = menuChoice[1]

    const seller = await profileSchema.findOne({ userId: ownerId })

    const customeritens = await profileSchema
      .findOne({ userId: memberId })
      .then((x) => Object.entries(x.customshopitens))

    const itensininventoryobj = customeritens.filter(
      ([, x]) => x.id == productId && x.owner == ownerId
    )

    let itensininventory

    if (itensininventoryobj[0]) {
      itensininventory = itensininventoryobj[0][1]
    }

    const updateObject = itensininventoryobj.reduce(
      (o, [key]) =>
        Object.assign(o, {
          [`customshopitens.${key}.price`]: itensininventory.price,
          [`customshopitens.${key}.size`]: itensininventory.size - 1,
          [`customshopitens.${key}.id`]: itensininventory.id,
          [`customshopitens.${key}.name`]: itensininventory.name,
          [`customshopitens.${key}.emoji`]: itensininventory.emoji,
          [`customshopitens.${key}.owner`]: memberId,
          [`customshopitens.${key}.shopName`]: seller.customshop.name,
        }),
      {}
    )

    //Atualiza os dados na conta da pessoa
    await profileSchema.findOneAndUpdate({ userId: memberId }, updateObject)

    interaction.reply(
      `Você consumiu 1 ${itensininventory.emoji} ${itensininventory.name} com sucesso`
    )
  },
}
