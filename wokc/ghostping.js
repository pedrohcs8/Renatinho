//Marcações fantasmas
const ghostPingSchema = require('@schemas/ghost-ping-schema')

module.exports = {
  requiredPermissions: [
    'ADMINISTRATOR'
  ],
  expectedArgs: '<Marcar o canal com #>',
  minArgs: 1,
  maxArgs: 1,
  callback: async ({ message }) => {
    const { mentions, guild } = message

    const targetChannel = mentions.channels.first()
    if (!targetChannel) {
      message.reply('Por favor marque um canal.')
      return
    }

    await ghostPingSchema.findOneAndUpdate({
      _id: guild.id
    }, 
    {
      _id: guild.id,
      channelId: targetChannel
    }, 
    {
      upsert: true,
    }
   );

    message.reply('Canal de marcações fantasmas setado!')
  }
}