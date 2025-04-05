const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js')
const { Util } = require('../../../../util')
const Emojis = require('../../../../util/Emojis')
const profileSchema = require('../../../../schemas/profile-schema')
const economy = require('@root/modules/economy')

module.exports = {
  subsincluded: true,
  category: 'Informação',
  data: new SlashCommandBuilder()
    .setName('background')
    .setDescription('Troque o background do seu perfil aqui')
    .addSubcommand((options) =>
      options
        .setName('list')
        .setDescription('Mostra a lista dos backgrounds disponíveis')
    )
    .addSubcommand((options) =>
      options
        .setName('buy')
        .setDescription('Comando para comprar um background')
        .addNumberOption((options) =>
          options
            .setName('id')
            .setDescription('Id do background que você quer')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(4)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('set')
        .setDescription('Seleciona o background que você quer')
        .addNumberOption((options) =>
          options
            .setName('id')
            .setDescription('Id do background que você quer')
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(4)
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { guild, member, options } = interaction

    const doc = await profileSchema.findOne({ userId: member.id })

    const backgrounds = {
      zero: {
        id: 0,
        price: 0,
        background: 'https://i.imgur.com/2mmK532.png',
      },
      one: {
        id: 1,
        price: 5000,
        background: 'https://i.imgur.com/lXdD2PF.jpg',
      },
      two: {
        id: 2,
        price: 10000,
        background: 'https://i.imgur.com/4KYQxdS.jpg',
      },
      three: {
        id: 3,
        price: 12000,
        background: 'https://i.imgur.com/AQGygrA.jpg',
      },
      four: {
        id: 4,
        price: 20000,
        background: 'seu',
      },
    }

    switch (options.getSubcommand()) {
      case 'list':
        {
          const list = doc.backgrounds.has
          const embed = new EmbedBuilder()
            .setTitle('Backgrounds disponíveis')
            .setDescription(
              `Background Ativo no Momento: **ID ${doc.backgrounds.active}**` +
                '\n\n' +
                Object.entries(backgrounds)
                  .filter(([, x]) => x.id != 0)
                  .map(
                    ([, x]) =>
                      `> **[ID ${x.id}](${
                        x.background
                      })**\n> Preço: RC:**${x.price.toLocaleString()}**\n> Status: **${
                        list.find((f) => f === x.id)
                          ? 'Já possui este background'
                          : 'Não tem'
                      }**`
                  )
                  .join('\n\n')
            )

          interaction.reply({ embeds: [embed] })
          return
        }
        break

      case 'set': {
        const id = options.getNumber('id')
        const list = doc.backgrounds.has

        if (id === 0) {
          interaction.reply('Background padrão ativado')
          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            { $set: { 'backgrounds.active': id } }
          )
          return
        } else if (id === 4) {
          if (doc.custombackground.has) {
            await profileSchema.findOneAndUpdate(
              { userId: member.id },
              { $set: { 'backgrounds.active': 4 } }
            )

            interaction.reply('Background personalizado ativo!')
            return
          } else {
            interaction.reply(
              'Use o comando custombackground pra comprar o customizar o background personalizado e volte aqui para aplicar'
            )
          }
        } else {
          if (!list.find((x) => x === id)) {
            return interaction.reply(`Você não tem esse background`)
          }

          await profileSchema.findOneAndUpdate(
            {
              userId: member.id,
            },
            { $set: { 'backgrounds.active': id } }
          )

          interaction.reply('Background setado com sucesso')
          return
        }
        break
      }

      case 'buy':
        {
          const list = doc.backgrounds.has
          const id = options.getNumber('id')
          if (list.find((x) => x === id)) {
            interaction.reply('Você já tem esse background.')
            return
          }

          if (id == 4) {
            interaction.reply(
              'Use o comando custombackground para obter mais informações sobre os backgrounds personalizados!'
            )
            return
          }

          let find = Object.entries(backgrounds).filter(
            ([, x]) => x.id === id
          )[0]

          if (!find.length) {
            interaction.reply('Não tenho nenhum background com esse ID.')
            return
          }

          let coinsOwned = await economy.getCoins(member.id)

          if (coinsOwned === undefined) {
            coinsOwned = 0
          }

          find = find[1]
          if (find.price > coinsOwned) {
            interaction.reply(
              'Você não tem renatocoins suficientes em mãos para comprar esse item.'
            )
            return
          }

          interaction.reply(
            `Background comprado e ativado com sucesso! Comprado por RC${find.price}`
          )

          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            { $push: { 'backgrounds.has': id } }
          )
          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            { $set: { 'backgrounds.active': id } }
          )

          await economy.addCoins(member.id, find.price * -1)

          return
        }
        break
    }
  },
}
