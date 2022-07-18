const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')
const moment = require('moment')
require('moment-duration-format')

module.exports = class StealCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'steal'
    this.category = 'Economy'
    this.description = 'Comando para roubar renatocoins de membros'
    this.usage = 'steal <@ da pessoa>'
    this.aliases = ['roubar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const user =
      this.client.users.cache.get(args[0]) || message.mentions.users.first()

    const { guild, member } = message

    const doc = await profileSchema.findOne({ userId: message.author.id })
    const target = await profileSchema.findOne({ userId: user.id })

    const cooldown = 8.64e7
    const user_cd = 1.728e8

    if (!user) {
      message.reply('Você deve mencionar quem deseja roubar.')
      return
    }

    if (user.id === message.author.id) {
      message.reply('Você não pode roubar você mesmo')
      return
    }

    if (cooldown - (Date.now() - doc.steal.time) > 0)
      return message.reply(
        `${message.author}, você deve aguardar **${moment
          .duration(cooldown - (Date.now() - doc.steal.time))
          .format('h [horas] m [minutos] e s [segundos]')
          .replace('minsutos', 'minutos')}** até poder roubar novamente.`
      )

    if (user_cd - (Date.now() - target.steal.protection) > 0)
      return message.reply(
        `${message.author}, o membro está em proteção por **${moment
          .duration(user_cd - (Date.now() - target.steal.protection))
          .format('d [dias] h [horas] m [minutos] e s [segundos]')
          .replace('minsutos', 'minutos')}**.`
      )

    let targetCoins = target.coins

    if (targetCoins < 2000) {
      message.reply(
        'Você não pode roubar um membro com menos de **RC2000** na carteira(mão)'
      )
      return
    }

    const percentage = Math.floor(Math.random() * 30) + 1

    const money = Math.ceil((percentage / 100) * targetCoins)

    if (money == NaN) {
      message.reply(
        'Você não pode roubar este usuário pois não tenho dados sobre ele, posso coleta-los quando ele mandar uma mensagem.'
      )
      return
    }

    message.reply(
      `Usuário roubado com sucesso, você ganhou **${money}** do usuário.`
    )

    //Target
    await economy.addCoins(guild.id, user.id, money * -1)

    //Author

    await profileSchema.findOneAndUpdate(
      { userId: message.author.id },
      { $inc: {coins: money } }
    )

    await profileSchema.findOneAndUpdate(
      { userId: message.author.id },
      { $set: { 'steal.time': Date.now() } }
    )
    await profileSchema.findOneAndUpdate(
      { userId: user.id },
      { $set: { 'steal.protection': Date.now() } }
    )
  }
}
