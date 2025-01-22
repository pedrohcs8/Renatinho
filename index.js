require('module-alias/register')
require('dotenv').config()

//Olá me chamo renato, prazer!

// ----------| Packages do Discord |----------

const Discord = require('discord.js')
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require('discord.js')
const { EmbedBuilder } = require('discord.js')

// ----------| Packages dos Comandos |----------

// - Comandos de Prefixo

const klaw = require('klaw')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)
const Files = require('./util/Files')
const c = require('colors')
const path = require('path')
const fs = require('fs')

// - Slash Commands

const { glob } = require('glob')
const PG = promisify(glob)
const Ascii = require('ascii-table')

//  - Distube

const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { YouTubePlugin } = require('@distube/youtube')
// const { YtDlpPlugin } = require('@distube/yt-dlp')

// -

const { Guilds, GuildMembers, GuildMessages, MessageContent } =
  GatewayIntentBits

const { User, Message, GuildMember, ThreadMember } = Partials

const { loadEvents } = require('./slashcmds/Handlers/Events')
const { loadCommands } = require('./slashcmds/Handlers/Commands')

// ----------| Comandos Variados |----------

const config = require('@root/config.json')
const privateMessage = require('@util/private-message')
const command = require('@util/command')

// ----------| Utils |----------

const mongo = require('@util/mongo')
const EventEmitter = require('events')

// ----------| Handlers Antigos de Comandos (WOK) |----------

// ----------|--|----------

// -- Clients --

class Main extends Client {
  constructor(options) {
    super(options)
    this.commands = new Collection()
    this.aliases = new Collection()
    this.database = new Collection()
    this.config = require('./config.json')

    //Sub comandos
    this.subcommands = new Collection()

    //Slash Commands
    this.slashcommands = new Collection()
    this.events = new Collection()
    this.slashsub = new Collection()
    this.guildConfig = new Collection()

    //Sistema de filtro
    this.filters = new Collection()
    this.filtersLog = new Collection()

    //Youtube
    this.youtubeChannels = new Array()
  }

  async login(token) {
    token = config.token
    await super.login(token)
    return [await this.initLoaders()]
  }

  async initLoaders() {
    return Files.requireDirectory('./loaders', (Loader) => {
      Loader.load(this).then(
        console.log(c.red('[Loaders] - Pasta Loaders carregada com sucesso.'))
      )
    })
  }
}
const client = new Main({
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    'GuildVoiceStates',
    'GuildMessageReactions',
    MessageContent,
  ],
  partials: [User, Message, GuildMember, ThreadMember],
})

client.ytPlugin = new YouTubePlugin({
  cookies: JSON.parse(fs.readFileSync('cookies.json')),
  ytdlOptions: {
    playerClients: ['IOS', 'WEB_CREATOR', 'ANDROID', 'WEB'],
  },
})

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  nsfw: true,
  plugins: [
    new SpotifyPlugin({
      api: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      },
    }),
    client.ytPlugin,
  ],
})

module.exports = client

const dbIndex = require('./schemas/index')
const { resolve } = require('path')
const { loadConfig } = require('./slashcmds/Functions/configLoader')
dbIndex.start()

// ----------| Eventos do Distube |----------

let errorTries = 0

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Efeitos: \`${
    queue.filters.names.join(', ') || 'Off'
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? 'Toda Fila'
        : 'Esta Música'
      : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `🎵 | Tocando \`${song.name}\` - \`${
        song.formattedDuration
      }\`\nPedido por: ${song.user}\n${status(queue)}`
    )
  )

  .on('addSong', (queue, song) =>
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Green')
          .setDescription(
            `📜 | Adicionei a música ${song.name} - \`${song.formattedDuration}\` na fila por ${song.user}`
          ),
      ],
    })
  )

  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `📜 | Adicionei a playlist \`${playlist.name}\` com (${
        playlist.songs.length
      } músicas) para a fila\n${status(queue)}`
    )
  )

  .on('error', async (error, queue, song) => {
    const stringE = error.toString().slice(0, 1974)
    errorTries++

    if (
      stringE == 'DisTubeError [UNPLAYABLE_FORMATS]: No playable format found'
    ) {
      if (errorTries > 10) {
        errorTries = 0
        return queue.textChannel.send(
          `Não consegui tocar esta música, tente novamente ou use um link`
        )
      }

      try {
        await queue.addToQueue(song)
        await queue.skip()
      } catch (e) {
        if (e == 'DisTubeError [NO_UP_NEXT]: There is no up next song') {
          return console.log('Error that needs proper patching by distube')
        }

        console.log(e)
      }
    } else {
      queue.textChannel.send(` | An error encountered: ${stringE}`)
    }
  })

  .on('empty', (queue) =>
    queue.textChannel.send('⛔ | O canal de voz ficou vazio por isso saí')
  )

  .on('searchNoResult', (message, query) =>
    message.channel.send(
      ` | Nenhum resultado foi encontrado para \`${query}\`!`
    )
  )

  .on('finish', (queue) => {
    queue.textChannel.send('📜 | A fila terminou, por isso saí do canal')
    queue.voice.leave()
  })
  
// TODO: Redo this system
// require('./slashcmds/Systems/giveaway-system')(client)

client.login()

module.exports = {
  Util: require('./util/index.js'),
}

EventEmitter.defaultMaxListeners = 150

client.on('ready', async () => {
  console.log('O client está pronto!')

  // Carrega os eventos, comandos e configurações ( -- SLASH COMMANDS -- )
  loadEvents(client)
  loadCommands(client)
  loadConfig(client)

  // ----------| Database |----------

  const dbOptions = {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }

  await mongo()

  //Status custom aleatório
  setInterval(() => {
    const statuses = [
      `Criado por pedrohcs8`,
      `Em desenvolvimento`,
      `Renato online!`,
      `Meu prefixo padrão é .`,
      `Hospedado em um Raspberry Pi 4!`,
      `Use help se necessário`,
    ]

    const status = statuses[Math.floor(Math.random() * statuses.length)]
    client.user.setActivity(status)
  }, 5000)

  // welcome(client)
  // exit(client)

  //sem ping pong :( e com derivados

  command(client, ['eae renatinho', 'oi renatinho'], (message) => {
    message.channel.send('Oi :)')
  })

  command(client, '157004', (message) => {
    message.channel.send(
      'Parabéns você descobriu a senha do celular do meu criador!'
    )

    const embed = new Discord.EmbedBuilder()
      .setAuthor(`Parabéns ${message.author}`)
      .setTitle(`Você descobriu meu help secreto!`)
      .addFields({
        name: 'Comandos Secretos!',
        value: `> 157004 - abre esse menu!\n> Meu @ - Mostra um menu simples de help\n> kapa - sofra as consequências...`,
      })
  })
  command(client, 'kapa', (message) => {
    message.channel.send('kappa kraio')
  })
  command(client, 'kappa', (message) => {
    message.channel.send('kappa!')
  })
  command(client, 'capa', (message) => {
    message.channel.send('ain nobru apelãum.')
  })

  //mensagens privadas

  privateMessage(client, 'ping', 'Pong!')
  privateMessage(client, 'oi renatinho', 'Oi :)')
  privateMessage(client, 'eae renatinho', 'Oi :)')
  privateMessage(
    client,
    '157004',
    'Parabéns você descobriu a senha do celular do meu criador!'
  )
  privateMessage(
    client,
    'kapa',
    'kappa kraio analfabeto do caralho aprende a escrever, filha da puta, shitposter desrespeitoso com a religião kapposa'
  )
  privateMessage(client, 'capa', 'nobru apelãun!')

  // ----------| |----------

  // ----------| Comandos Antigos (DEPRECATED) |----------

  // ----------| |----------
})
