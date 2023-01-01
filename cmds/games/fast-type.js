//Joguinho de escrever rápido
const Command = require('@util/structures/Command')
const { words } = require('@util/fast-type-words')

const example = {
  channelId: {
    message: 'message object',
    stage: 'string',
    counter: 'number',
    currentWord: 'string',
    remainingWords: ['words here'],
    points: {
      userId: 'points',
    },
  },
}

const games = {}

const stages = {
  STARTING: (counter) => {
    return `Um novo jogo vai começar em ${counter}s!`
  },
  IN_GAME: (word) => {
    let spacedWord = ''

    for (const character of [...word]) {
      spacedWord += character
      spacedWord += ' '
    }
    return `A nova palavra é **${spacedWord}**!`
  },
  ENDING: (points) => {
    const sorted = Object.keys(points).sort((a, b) => {
      return points[b] - points[a]
    })

    let results = ''

    for (const key of sorted) {
      const amount = points[key]
      results += `<@${key}> fez ${amount} ponto${amount === 1 ? '' : 's'}\n`
    }

    return `O jogo acabou!, aqui está o placar:\n\n${results}------------------------`
  },
}

const selectWord = (game) => {
  game.currentWord =
    game.remainingWords[Math.floor(Math.random() * game.remainingWords.length)]

  const index = game.remainingWords.indexOf(game.currentWord)
  game.remainingWords.splice(index, 1)
}

const gameLoop = () => {
  for (const key in games) {
    const game = games[key]
    const { message, stage } = game

    if (stage === 'STARTING') {
      let string = stages[stage](game.counter)
      message.edit(string)

      if (game.counter <= 0) {
        game.stage = 'IN_GAME'
        game.counter = 15

        selectWord(game)

        string = stages[game.stage](game.currentWord)
        message.edit(string)
      }
    } else if (stage === 'IN_GAME') {
      if (game.counter <= 0) {
        game.stage = 'ENDING'

        const string = stages[game.stage](game.points)
        message.edit(string)

        delete games[key]

        continue
      }
    }

    --game.counter
  }

  setTimeout(gameLoop, 2000)
}

module.exports = class FastTypeCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'fasttype'
    this.category = 'Games'
    this.description = 'Comando para iniciar uma partida de digitar rápido'
    this.usage = 'fasttype'
    this.aliases = ['fastype', 'digitarrapido']

    this.enabled = true
    this.guildOnly = true

    client.on('messageCreate', (message) => {
      const { channel, content, member } = message
      const { id } = channel

      const game = games[id]

      if (game && game.currentWord && !member.user.bot) {
        message.delete()

        if (
          game.stage === 'IN_GAME' &&
          content.toLowerCase() === game.currentWord.toLowerCase()
        ) {
          game.currentWord = null
          const seconds = 2

          const { points } = game
          points[member.id] = points[member.id] || 0

          message
            .channel.send(`Você ganhou! +1 ponto (${++points[member.id]} no total)`)
            .then((newMessage) => {
              newMessage.delete({
                timeout: 1000 * seconds,
              })
            })

          setTimeout(() => {
            if (game.stage === 'IN_GAME') {
              selectWord(game)

              const string = stages[game.stage](game.currentWord)
              game.message.edit(string)
            }
          }, 1000 * seconds)
        }
      }
    })

    gameLoop()
  }

  async run({ message, args, prefix, author }) {
    const { channel } = message

    message.delete()
    channel.send('Preparando jogo...').then((message) => {
      games[channel.id] = {
        message,
        stage: 'STARTING',
        counter: 5,
        remainingWords: [...words],
        points: {},
      }
    })
  }
}
