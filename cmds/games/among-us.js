const Command = require('@util/structures/Command')
const AmongUsCategorySchema = require('@schemas/among-us-category-schema')
const { MessageEmbed, CategoryChannel } = require('discord.js')

const channelNameStart = 'Among Us'

module.exports = class AmongUSCategoryCommmand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'amongus'
    this.category = 'Games'
    this.description = 'Comando divulgar sua partida de among us'
    this.usage = 'amongus <região do servidor> <código>'
    this.aliases = ['au', 'amongus']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const [region, code] = args

    if (!region) {
      message.reply('Por favor especifique uma região')
      return
    }

    if (!code) {
      message.reply('Por favor especifique um código de jogo')
      return
    }

    const { channel, guild, member } = message

    const categoryDocument = await AmongUsCategorySchema.findOne({
      _id: guild.id,
    })

    if (!categoryDocument) {
      message.reply('Uma categoria de Among-Us não foi setada nesse servidor')
      return
    }

    const channelName = `${channelNameStart} "${code}"`
    await guild.channels.create(channelName, {
      type: 'voice',
      userLimit: 10,
      parent: categoryDocument.categoryId,
    })

    const embed = new MessageEmbed()
      .setAuthor(
        member.nickname || member.displayName,
        member.user.displayAvatarUrl,
      )
      .setDescription(
        `${member} criou uma novo jogo de Among Us! Entre no canal "${channelName}"`,
      )
      .addField('Região', region)
      .addField('Código', code)

    channel.send({ embeds: [embed] })
  }
}
