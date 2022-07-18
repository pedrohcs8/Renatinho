//Formulário de ADM Surpice
const DiscordJS = require('discord.js')

module.exports = {
  callback: (message) => {
    const questions = [
      'Qual o seu nick no discord?(exemplo: Quico#1213)',
      'Você é ativo?(sim ou não)',
      'Quais dias da semana você fica online?(segunda, terça, etc)',
      'Você vai dar prioridade ao nosso servidor?(sim ou não)',
      'Por que você quer fazer parte da staff?',
      'Você leu as regras?(sim ou não)',
      'Caso um membro seja ofenda o outro, o que você faria?',
      'Você seria rigoroso nos mutes?(sim ou não)',
      'Caso um membro seja RHP com outro, o que você faria?(RHP = Racista, homofóbico e(ou) preconceituoso)',
      'Qual a sua idade?',
      'Conte sobre você.(Conte um pouco sobre a sua história.)',
      'Como encontrou o nosso servidor?',
      'Você já foi staff de algum outro servidor do discord? se sim qual?',
    ]
    let counter = -0

    const filter = (m) => {
      return m.author.id === message.author.id
    }

    const collector = new DiscordJS.MessageCollector(message.channel, filter, {
      max: questions.length,
      time: 1000 * 5 * 60, // 5m
    })

    message.reply(questions[counter++])
    collector.on('collect', (m) => {
      if (counter < questions.length) {
        m.channel.send(questions[counter++])
      } else {
        m.channel.send('formulário enviado! Será analizado em até 24 horas')
      }
    })

    collector.on('end', (collected) => {
      console.log(`Coletei ${collected.size} mensagens`)

      if (collected.size < questions.length) {
        message.reply('Você não respondeu as perguntas à tempo')
        return
      }

      const { guild } = message

      const channelId = '826933592918589440'
      const channel = guild.channels.cache.get(channelId)

      let counter = 0
      collected.forEach((value) => {
        channel.send(`${value.content}`)
      })
    })
  },
}
