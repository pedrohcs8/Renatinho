//Contador de menssagem
const mongo = require('@util/mongo')
const messageCountSchema = require('@schemas/message-count-schema')

module.exports = (client) => {
  client.on('messageCreate', async (message) => {
    const { author } = message
    const { id } = author

    await messageCountSchema
      .findOneAndUpdate(
        {
          _id: id,
        },
        {
          $inc: {
            messageCount: 1,
          },
        },
        {
          upsert: true,
        },
      )
      .exec()
  })
}
