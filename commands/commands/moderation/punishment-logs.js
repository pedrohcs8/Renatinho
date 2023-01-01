//Log de mutes
const mongo = require('@util/mongo')
const punishmentLogSchema = require('@schemas/punishment-log-schema')
module.exports = {
  commands: ['logmute', 'mutelog'],
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<Usuário alvo @>',
  permission: 'ADMINISTRATOR',
  callback: async (message, arguments) => {
    const target = message.mentions.users.first()
    if (!target) {
      message.reply('Por favor marque alguém para carregar os mutes.')
      return
    }

    const { guild } = message
    const { id } = target
        const results = await punishmentLogSchema.find({
          guildId: guild.id,
          userId: id
        })

        let reply = 'Mutes antigos:\n\n'

        for (const result of results) {
          reply += `${result.command} foi rodado no dia ${new Date(
            result.createdAt
          ).toLocaleDateString()}\n\n`
        }

        message.reply(reply)
  }
}