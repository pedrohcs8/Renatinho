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

// - Slash Commands

const { glob } = require('glob')
const PG = promisify(glob)
const Ascii = require('ascii-table')

const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')

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

const messageCount = require('@features/message-counter')
const tempchannel = require('@features/temp-channel')
const mongo = require('@util/mongo')
const EventEmitter = require('events')
const poll = require('@features/poll')

// ----------| Handlers Antigos de Comandos (WOK) |----------

const loadFeatures = require('@root/features/load-features')

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

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  nsfw: true,
  youtubeCookie:
    'HSID=AXYvEaqHZUCd03Fhn; SSID=AHvfYGU8Wn1Ax7pAP; APISID=2TJhbpT4BCWhOPTK/ADGn7U669m4t5vnW3; SAPISID=dOyFlSX63QFmCq-I/AY5xdOIEmsl284JlT; __Secure-1PAPISID=dOyFlSX63QFmCq-I/AY5xdOIEmsl284JlT; __Secure-3PAPISID=dOyFlSX63QFmCq-I/AY5xdOIEmsl284JlT; SID=SQiWSoUFbazMKYXrcD8oz0W5ppc6xylk935fn6hGmoDBSNYNmjtfA3vRxzwZFKH-fIw9pQ.; __Secure-1PSID=SQiWSoUFbazMKYXrcD8oz0W5ppc6xylk935fn6hGmoDBSNYN3GTLF-GA7yVvuG8hM96ScQ.; __Secure-3PSID=SQiWSoUFbazMKYXrcD8oz0W5ppc6xylk935fn6hGmoDBSNYNI8i6bf1n9-vHTNmO4yN9EQ.; YSC=8B_EK00tan0; VISITOR_INFO1_LIVE=J2XawjwebDA; LOGIN_INFO=AFmmF2swRgIhAPBVNEaFs1zElvTITIR73a5urCG7gy9TyxWd_8C6AZtPAiEA8K5VXBCQnQkdJAY1LFSK6LiAyilY6A3W-J8mN5blHgM:QUQ3MjNmekZuN0Z5a2FfRnU5Y3VoWmxKZWV6T0ZKTUtjSlFsRFo4NTNMZjBVQVlpWFB4clJqd2VsbV80eEdxTGZPeW1lazlJQ1YtVFVwem9Rb2xjZVA3bTVmY2l5U2FDeWJNTUxfenhqSUNvTVZ6SlJKWVdjTG1OcjltS2FOaENaTHNKWkNRaFBRNGQzVERDYzFLNTloTVNrLTRyTS1MeU1B; PREF=tz=America.Cuiaba; CONSISTENCY=ACHmjUpvNxWR1WwcyiYLS0QWSLH5rbaHk4e_5zb8jQeD6OcZvDO6hS9RCftULEYA-mR8vSqZI1Tk1gnJ_oXb_f25EqPd8ySoL4f22FP4t7ky_FVTDkoNSKmx32dw4yqRRueggSn4f57OyAQ48B2t6M70; SIDCC=AIKkIs1nbIEUwwfHX-lP2UEIGU9Hg4sRnuCJbaUCOVak5M7Wekh_2uEBpuoLzHSbY5SW76GV; __Secure-1PSIDCC=AIKkIs3dtz1mi1WTDwuts8-uxfDKWYlNqOfB-VaXzmyhHT3C8pf1RAemH-yKPb5AiWsl9S8s; __Secure-3PSIDCC=AIKkIs10dYM_m6CLuGPMkILX5OOhsqwLws7uYgKkwXLjQnCA1VH6PfqDHJbtbi8v_m5WHivK_A',
  plugins: [new SpotifyPlugin()],
})

module.exports = client

const dbIndex = require('./schemas/index')
const { resolve } = require('path')
const { loadConfig } = require('./slashcmds/Functions/configLoader')
dbIndex.start()

// ----------| Eventos do Distube |----------

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

  .on('error', (channel, e) => {
    channel.send(` | An error encountered: ${e.toString().slice(0, 1974)}`)
    console.error(e)
  })

  .on('empty', (queue) =>
    queue.textChannel.send('⛔ | O canal de voz ficou vazio por isso saí')
  )

  .on('searchNoResult', (message, query) =>
    message.channel.send(
      ` | Nenhum resultado foi encontrado para \`${query}\`!`
    )
  )

  .on('finish', (queue) =>
    queue.textChannel.send('📜 | A fila terminou, por isso saí do canal')
  )

require('./slashcmds/Systems/giveaway-system')(client)

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
  // setInterval(() => {
  //   const statuses = [
  //     `Trabalhando no Surpice`,
  //     `Criado por pedrohcs8`,
  //     `Em desenvolvimento`,
  //     `Com host :)`,
  //     `Renato online!`,
  //     `Meu prefixo padrão é .`,
  //     `Hospedado em um Raspberry Pi 4!`,
  //     `Online - Cluster 1-Renato-Host`,
  //     `Use .help se necessário`,
  //   ]

  //   const status = statuses[Math.floor(Math.random() * statuses.length)]
  //   client.user.setActivity(status, { type: 'PLAYING' })
  // }, 5000)

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
  loadFeatures(client)

  messageCount(client)

  tempchannel(client)

  poll(client)

  // ----------| |----------
})
