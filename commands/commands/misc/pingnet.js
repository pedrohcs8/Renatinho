//Mostra as latências do bot
module.exports = {
    commands: 'pingnet',
    callback: (message, arguments, text, client) => {
      message.reply('Calculando ping...').then((resultMessage) => {
        const ping = resultMessage.createdTimestamp - message.createdTimestamp
  
        resultMessage.edit(`Latência do bot: ${ping}, Latência da API: ${client.ws.ping}`)
      })
    },
  }