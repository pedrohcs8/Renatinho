const Command = require('@structures/Command')
const thanksSchema = require('@schemas/thanks-schema')

module.exports = class ThanksCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'thanks'
    this.category = 'Misc'
    this.description = 'Comando para agradecer alguém'
    this.usage = 'thanks <@ da pessoa>'
    this.aliases = ['thanks', 'thx']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const target = message.mentions.users.first()
    if (!target) {
      message.reply('Por favor especifique alguém para agradecer')
      return
    }

    const { guild } = message
    const guildId = guild.id
    const targetId = target.id
    const authorId = message.author.id
    const now = new Date()

    if (targetId === authorId) {
      message.reply('Você não pode agradecer você mesmo')
      return
    }

    const authorData = await thanksSchema.findOne({
      userId: authorId,
      guildId,
    })

    if (authorData && authorData.lastGave) {
      const then = new Date(authorData.lastGave)

      const diff = now.getTime() - then.getTime()
      const diffHours = Math.round(diff / (1000 * 60 * 60))

      const hours = 24
      if (diffHours <= hours) {
        message.reply(`Você já agradeceu alguém nas últimas ${hours} horas.`)
        return
      }
    }

    await thanksSchema.findOneAndUpdate(
      {
        userId: authorId,
        guildId,
      },
      {
        userId: authorId,
        guildId,
        lastGave: now,
      },
      {
        upsert: true,
      }
    )

    const result = await thanksSchema.findOneAndUpdate(
      {
        userId: targetId,
        guildId,
      },
      {
        userId: targetId,
        guildId,
        $inc: {
          received: 1,
        },
      },
      {
        upsert: true,
        new: true,
      }
    )

    const amount = result.received
    message.reply(
      `Você agradeceu <@${targetId}>! Ele(a) agora tem ${amount} agradecimento(s).`
    )
  }
}
