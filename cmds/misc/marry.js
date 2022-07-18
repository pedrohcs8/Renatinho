const Command = require('@util/structures/Command')
const Emojis = require('@util/Emojis')
const profileSchema = require('@schemas/profile-schema')

module.exports = class MarryCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'marry'
    this.category = 'Fun'
    this.description = 'Comando para casar com a cremosa(o😏)'
    this.usage = 'marry [texto]'
    this.aliases = ['marry', 'casar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const user =
      message.mentions.users.first() || this.client.users.cache.get(args[0])

    if (!args[0] || !user) {
      message.reply('Mecione alguém para se casar.')
      return
    }

    const target = await profileSchema.findOne({ userId: user.id })
    const results = await profileSchema.findOne({ userId: message.author.id })

    const { marry: marryta } = target
    const { marry: marryre } = results

    console.log(marryre, marryta)

    if (user.id === message.author.id) {
      message.reply('Você não pode se casar com você mesmo.')
      return
    }

    if (marryre.has) {
      message.reply('Você está casado')
      return
    }

    if (marryta.has) {
      message.reply(
        `Essa pessoa já está casada! Com **\`${await this.client.users.fetch(
          marryta.user,
        ).tag}\`**`,
      )
      return
    }

    const filter = (reaction, member) => {
      return (
        member.id === user.id &&
        [Emojis.Certo, Emojis.Errado].includes(reaction.emoji.name)
      )
    }
    message.channel
      .send(`${user} você deseja se casar com ${message.author}?`)
      .then(async (msg) => {
        for (let emoji of [Emojis.Certo, Emojis.Errado]) await msg.react(emoji)

        msg
          .awaitReactions({ filter: filter, max: 1 })
          .then(async (collected) => {
            if (collected.first().emoji.name === Emojis.Certo) {
              message.reply('O(a) aceitou seu pedido de casamento, parabéns.')

              await profileSchema.findOneAndUpdate(
                { userId: message.author.id },
                {
                  $set: {
                    'marry.user': user.id,
                    'marry.has': true,
                    'marry.time': Date.now(),
                  },
                },
              )
              await profileSchema.findOneAndUpdate(
                { userId: user.id },
                {
                  $set: {
                    'marry.user': message.author.id,
                    'marry.has': true,
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
                `${user}, recusou seu pedido de casamento ${message.author}`,
              )
              return
            }
          })
      })
  }
}
