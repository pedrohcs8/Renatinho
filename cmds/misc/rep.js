const { MessageEmbed } = require('discord.js')
const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const moment = require('moment')
require('moment-duration-format')

module.exports = class RepCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'rep'
    this.category = 'Misc'
    this.description = 'Comando para avaliar alguém'
    this.usage = 'rep [@ da pessoa]'
    this.aliases = ['rep', 'avaliar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const userId =
      this.client.users.cache.get(args[0]) || message.mentions.users.first()

    const results = await profileSchema.findOne({ userId: message.author.id })
    if (results == 'null') {
      message.reply(`Este usuário não está registrado em minha database.`)
      return
    }
    const result = await profileSchema.findOne({ userId: userId.id })
    const reps = results.reps
    const cooldown = 7.2e6 - (Date.now() - reps.time)

    if (cooldown > 0) {
      message.reply(
        `Você deve aguardar  **${moment
          .duration(cooldown)
          .format('h [horas] m [minutos] e s [segundos]')
          .replace('minsutos', 'minutos')}** para avaliar novamente.`,
      )
      return
    }
    if (!userId) {
      message.reply('Você deve mencionar alguém para avaliar.')
      return
    }

    message.reply(`Você avaliou o usuário **${userId.tag}** com sucesso!`)

    await profileSchema.findOneAndUpdate(
      { userId: message.author.id },
      { $set: { 'reps.lastSend': userId.id, 'reps.time': Date.now() } },
    )
    await profileSchema.findOneAndUpdate(
      { userId: userId.id },
      {
        $set: {
          'reps.lastRep': message.author.id,
          'reps.size': result.reps.size + 1,
        },
      },
    )
  }
}
