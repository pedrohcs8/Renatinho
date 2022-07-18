//Modificador de prefixo
const mongo = require('@util/mongo')
const commandPrefixSchema = require('@schemas/command-prefix-schema')

const commandBase = require('@commandbase/command-base')

module.exports = {
  commands: 'setprefix',
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "<This bot's new command prefix>",
  permissionError: 'You must be an admin to run this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments, text) => {
        const guildId = message.guild.id
        const prefix = arguments[0]

        await commandPrefixSchema.findOneAndUpdate(
          {
            _id: guildId,
          },
          {
            _id: guildId,
            prefix,
          },
          {
            upsert: true,
          }
        )

        message.reply(`O prefixo para esse bot é agora ${prefix}`)

        commandBase.updateCache(guildId, prefix)
      }
  }