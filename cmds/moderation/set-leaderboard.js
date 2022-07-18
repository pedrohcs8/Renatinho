const Command = require('@structures/Command')
const thanksLeaderboardSchema = require('@schemas/thanks-leaderboard-schema')

module.exports = class SetLeaderBoard extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'setleaderboard'
    this.category = 'Moderation'
    this.description = 'Comando para setar um top 10 de agradecimentos'
    this.usage = 'setleaderboard'
    this.aliases = ['setleaderboard']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }
    const { guild, channel } = message
    const guildId = guild.id
    const channelId = channel.id

    await thanksLeaderboardSchema.findOneAndUpdate(
      {
        _id: guildId,
        channelId,
      },
      {
        _id: guildId,
        channelId,
      },
      {
        upsert: true,
      }
    )

    message.reply('Placar de agradecimentos setado!').then((message) => {
      message.delete({
        timeout: 1000 * 5,
      })
    })
    message.delete()
  }
}
