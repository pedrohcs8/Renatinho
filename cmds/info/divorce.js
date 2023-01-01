const Command = require('@util/structures/Command')
const Emojis = require('@util/Emojis')
const profileSchema = require('@schemas/profile-schema')

module.exports = class DivorceCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'divorce'
    this.category = 'Info'
    this.description = 'Comando para se divorciar.'
    this.usage = 'divorce'
    this.aliases = ['divoce', 'divorcio']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const results = await profileSchema.findOne({ userId: message.author.id })

    const { marry: marryre } = results

    if (!marryre.has) {
      message.reply(`Você não está casado`)
      return
    }

    message.channel
      .send(
        `${
          message.author
        } você deseja se separar de **\`${await this.client.users
          .fetch(results.marry.user)
          .then((x) => x.tag)}**\`?`,
      )
      .then(async (msg) => {
        for (let emoji of [Emojis.Certo, Emojis.Errado]) await msg.react(emoji)

        const filter = (reaction, member) => {
          return (
            member.id === user.id &&
            [Emojis.Certo, Emojis.Errado].includes(reaction.emoji.name)
          )
        }

        msg
          .awaitReactions({ filter: filter, max: 1 })
          .then(async (collected) => {
            if (collected.first().emoji.name === Emojis.Certo) {
              message.reply('Você se divorciou com sucesso.')

              await profileSchema.findOneAndUpdate(
                { userId: message.author.id },
                {
                  $set: {
                    'marry.user': 'null',
                    'marry.has': false,
                    'marry.time': 0,
                  },
                },
              )
              await profileSchema.findOneAndUpdate(
                { userId: results.marry.user },
                {
                  $set: {
                    'marry.user': 'null',
                    'marry.has': false,
                    'marry.time': Date.now(),
                  },
                },
              )

              msg.delete()
              return
            }

            if (collected.first().emoji.name === Emojis.Errado) {
              msg.delete()

              message.reply(
                `${message.author}, seu pedido de divórcio foi cancelado.`,
              )
              return
            }
          })
      })
  }
}
