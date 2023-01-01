//Adiciona moedas á alguém
const economy = require('@features/economy')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = {
  commands: ['removebalance', 'rembalance'],
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: "<O @ do usuário> <quantidade de renatocoins>",
  permissionError: 'Você deve ser um administrador.',
  permissions: 'ADMINISTRATOR',
  description: 'Gives a user coins.',
  callback: async (message, arguments) => {
    const mention = message.mentions.users.first()

    const user = await profileSchema.findOne({userId: mention.id})

    const newCoins = user.coins

    if (!mention) {
      message.reply('Marque um usuário para tirar renatocoin(s).')
      return
    }

    const coins = arguments[1]
    if (isNaN(coins)) {
      message.reply('Dê um número de moedas válidas.')
      return
    }

    const guildId = message.guild.id
    const userId = mention.id
    const userId2 = message.author.id

    const dono = '227559154007408641'

    if (userId2 !== dono) {
      message.reply('**Só o pedrohcs8#4185 pode usar esse comando!**')
      return
    }

    await profileSchema.findOneAndUpdate(
      { userId: mention.id },
      { $inc: { coins: coins * -1 } }
    )

    message.reply(
      `Você retirou de <@${userId}> ${coins} renatocoin(s). Ele agora tem ${newCoins} renatocoin(s).`
    )
  },
}