const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop-list')
    .setDescription('Mostra os itens na loja da pessoa')
    .addUserOption((options) =>
      options
        .setName('vendedor')
        .setDescription('O dono da loja que você gostaria de ver os itens')
        .setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { options } = interaction
    const mention = options.getUser('vendedor')

    if (mention) {
      const data = await profileSchema.findOne({ userId: mention.id })

      const itens = await profileSchema
        .findOne({ userId: mention.id })
        .then((x) => Object.entries(x.customshop.itens))

      interaction.reply(
        `Lista dos item que tem na loja **${data.customshop.name}** de ${
          data.customshop.owner == 'null'
            ? mention
            : client.users.cache.find(
                (user) => user.id === data.customshop.owner
              )
        }\n\n${itens
          .map(([, x]) => x)
          .filter((x) => x != true)
          .map(
            (x) =>
              `> ID: **${x.id}** ( Nome: **${x.emoji} ${
                x.name
              }** )\n> Valor: **\`${sellingPrice(x.price)}\`**`
          )
          .join('\n\n')}`
      )
      return
    }
  },
}

function sellingPrice(costPrice) {
  return costPrice + costPrice * 0.2
}
