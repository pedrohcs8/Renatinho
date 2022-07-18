//Manda para todos os servidores seguidores a mensagem do canal de anúncios
module.exports = (client) => {
  client.on('messageCreate', (message) => {
    const { channel } = message

    if (channel.type === 'news') {
      message.crosspost()
      console.log('mandou a mensagem de notícia')
    }
  })
}
