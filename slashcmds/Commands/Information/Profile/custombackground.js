const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require('discord.js')
const profileSchema = require('../../../../schemas/profile-schema')
const fs = require('fs')
const download = require('node-image-downloader')
const economy = require('@features/economy')

module.exports = {
  subsincluded: true,
  category: 'Informação',
  data: new SlashCommandBuilder()
    .setName('custombackground')
    .setDescription('Configure seu background customizado aqui')
    .addAttachmentOption((options) =>
      options
        .setName('foto')
        .setDescription('Foto que será usada de foto de fundo')
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName('cor-da-fonte')
        .setDescription(
          'Para pegar a cor utilize esse site: https://html-color-codes.info/'
        )
        .setRequired(false)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, member } = interaction

    const doc = await profileSchema.findOne({ userId: member.id })

    const image = options.getAttachment('foto')
    const filename = image.name

    const fontColor =
      options.getString('cor-da-fonte') == null
        ? '#FFFFFF'
        : options.getString('cor-da-fonte')

    if (image.size > 6000000) {
      return interaction.reply(
        'Essa imagem é muito grande ( ~~Os bots só podem mandar imagens até 8mb!~~ )'
      )
    }

    //Tem background customizado
    if (doc.custombackground.has) {
      //Deletar a foto antiga da memória do bot
      fs.unlinkSync(`${doc.custombackground.path}`)
      console.log('Foto de fundo customizada antiga deletada!')

      download({
        imgs: [
          {
            uri: image.url,
          },
        ],
        dest: './images', //destination folder
      }).catch((error, response, body) => {
        console.log('something goes bad!')
        console.log(error)
      })

      await profileSchema.findOneAndUpdate(
        { userId: member.id },
        {
          $set: {
            'custombackground.active': true,
            'custombackground.path': `./images/${filename}`,
            'custombackground.fontColor': `${fontColor}`,
            'backgrounds.active': 4,
          },
        },
        {
          upsert: true,
        }
      )

      interaction.reply(
        `Você trocou sua foto de fundo customizada ${
          fontColor !== '#FFFFFF'
            ? `e a cor da sua fonte para ${fontColor}`
            : ''
        } com sucesso`
      )
    } else {
      let coinsOwned = await economy.getCoins(member.id)

      if (coinsOwned === undefined) {
        coinsOwned = 0
      }

      if (coinsOwned < 20000) {
        return interaction.reply(
          'Você não tem dinheiro suficiente em mãos para comprar esse background. Ele custa 20000 renatocoins'
        )
      }

      await economy.addCoins(member.id, 20000 * -1)

      download({
        imgs: [
          {
            uri: image.url,
          },
        ],
        dest: './images', //destination folder
      }).catch((error, response, body) => {
        console.log('something goes bad!')
        console.log(error)
      })

      await profileSchema.findOneAndUpdate(
        { userId: member.id },
        {
          $set: {
            'custombackground.active': true,
            'custombackground.path': `./images/${filename}`,
            'custombackground.has': true,
            'custombackground.fontColor': fontColor,
            'backgrounds.active': 4,
          },
        },
        {
          upsert: true,
        }
      )

      interaction.reply(
        'Você comprou e ativou com sucesso sua foto de fundo customizada'
      )
    }
  },
}
