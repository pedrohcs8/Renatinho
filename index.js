require('module-alias/register')
require('dotenv').config()

//Olá me chamo renato, prazer!

// ----------| Packages do Discord |----------

const Discord = require('discord.js')
const { Client, Collection } = require('discord.js')
const { MessageEmbed } = require('discord.js')

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

// ----------| Handlers Antigos de Comandos |----------

const loadCommands = require('@root/commands/load-commands')
const loadFeatures = require('@root/features/load-features')

// ----------|--|----------

// -- Clients --

class Main extends Client {
    constructor(options) {
        super(options)
        this.commands = new Collection()
        this.aliases = new Collection()
        this.database = new Collection()

        //Sub comandos
        this.subcommands = new Collection()
        this.slashcommands = new Collection()

        //Sistema de filtro
        this.filters = new Collection()
        this.filtersLog = new Collection()

        //Youtube
        this.youtubeChannels = new Array()

        //Handler de Botões
        this.buttons = new Collection()
    }

    async login(token) {
        token = config.token
        await super.login(token)
        return [await this.initLoaders()]
    }

    load(commandPath, commandName) {
        const props = new (require(`${commandPath}/${commandName}`))(this)
        if (props.isSub) {
            if (!this.subcommands.get(props.reference)) {
                this.subcommands.set(props.reference, new Collection())
            }
            this.subcommands.get(props.reference).set(props.name, props)
        }
        if (props.isSub) return
        props.location = commandPath
        if (props.init) {
            props.init(this)
        }
        this.commands.set(props.name, props)
        props.aliases.forEach(aliases => {
            this.aliases.set(aliases, props.name)
        })
    }

    async initLoaders() {
        return Files.requireDirectory('./loaders', Loader => {
            Loader.load(this).then(
                console.log(c.red('[Loaders] - Pasta Loaders carregada com sucesso.'))
            )
        })
    }
}

const dbIndex = require('./schemas/index')
const { resolve } = require('path')
dbIndex.start()

const client = new Main({
    intents: 32767
})

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
})

module.exports = client

// ----------| Eventos do Distube |----------

const status = queue =>
    `Volume: \`${queue.volume}%\` | Filtro: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Toda Fila' : 'Esta Música') : 'Off'
    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

client.distube
    .on('playSong', (queue, song) =>
        queue.textChannel.send(
            `🎵 | Tocando \`${song.name}\` - \`${song.formattedDuration}\`\nPedido por: ${song.user
            }\n${status(queue)}`
        )
    )

    .on('addSong', (queue, song) =>
        queue.textChannel.send(
            {
                embeds: [new MessageEmbed().setColor('GREEN').setDescription(`📜 | Adicionei a música ${song.name} - \`${song.formattedDuration}\` na fila por ${song.user}`)]
            }
        )
    )

    .on('addList', (queue, playlist) =>
        queue.textChannel.send(
            `📜 | Adicionei a playlist \`${playlist.name}\` com (${playlist.songs.length
            } músicas) para a fila\n${status(queue)}`
        )
    )

    .on('error', (channel, e) => {
        channel.send(` | An error encountered: ${e.toString().slice(0, 1974)}`)
        console.error(e)
    })

    .on('empty', queue => queue.textChannel.send('⛔ | O canal de voz ficou vazio por isso saí'))

    .on('searchNoResult', (message, query) =>
        message.channel.send(` | Nenhum resultado foi encontrado para \`${query}\`!`)
    )

    .on('finish', queue => queue.textChannel.send('📜 | A fila terminou, por isso saí do canal'))

require('./slashcmds/Systems/giveaway-system')(client)
    ;['Events', 'Commands', 'Buttons'].forEach(handler => {
        require(`./slashcmds/Handlers/${handler}`)(client, PG, Ascii)
    })

const onLoad = async () => {
    klaw('./cmds').on('data', item => {
        const cmdFile = path.parse(item.path)
        if (!cmdFile.ext || cmdFile.ext !== '.js') return
        const response = client.load(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`)
        if (response) return
    })

    const eventFiles = await readdir(`./client/listeningIn/`)
    eventFiles.forEach(file => {
        const eventName = file.split('.')[0]
        const event = new (require(`./client/listeningIn/${file}`))(client)
        client.on(eventName, (...args) => event.run(...args))
        delete require.cache[require.resolve(`./client/listeningIn/${file}`)]
    })

    client.login()
}

onLoad()

module.exports = {
    Util: require('./util/index.js')
}

EventEmitter.defaultMaxListeners = 150

client.on('ready', async () => {
    console.log('O client está pronto!')

    const dbOptions = {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }

    await mongo()

    client.on('messageCreate', message => {
        const messages = message.content

        if (message.author.id === '795418788655792129') {
            return
            //se for o bot não rola nada k
        }

        if (messages === '<@!795418788655792129>') {
            message.reply('O meu prefixo é **.**, se precisar de ajuda use **.help**')
        }

        if (messages === 'vai toma no cu') {
            message.reply('**Vai tu krl**')
        }

        if (messages === 'vai tu') {
            message.reply('Eu nem tenho cu porra sfd sou um robô.')
        }

        if (messages === 'fodase') {
            message.reply('Fodase o karaleo.')
        }

        if (messages === 'vsfd') {
            message.reply('**Vai tu krl**')
        }

        if (messages === 'gremio') {
            message.reply('Gremiover parça, gremio perde até para um tetraplégico')
        }

        if (messages === 'cala boca renato') {
            message.reply('**Cala tu**')
        }

        if (messages === 'cala boca') {
            message.reply('**Cala tu**')
        }
        if (messages === 'boa noite renatinho') {
            message.reply('Boa noite :)')
        }
        if (messages === 'bom dia renatinho') {
            message.reply('Bom dia :)')
        }
        if (messages === 'pao') {
            message.reply('Vini????????')
        }
        if (messages === 'pedro gay') {
            message.reply('Minha bola esquerda ele é totamente **H-E-T-E-R-O**!')
        }
        if (messages.toLocaleLowerCase() === 'macaquitos') {
            message.reply('Messi???!?!?!?!?!??!?!?!')
        }
        if (messages.toLocaleLowerCase() === 'corinthians') {
            message.reply('Melhor time slc')
        }
        if (messages.toLocaleLowerCase() === 'são paulo') {
            message.reply('Felipinas?!?!??!?!?!?')
        }
        if (messages.toLocaleLowerCase() === 'craque neto') {
            message.reply('**Um monstro jogando bola**')
        }
        if (messages.toLocaleLowerCase() === 'maestro') {
            message.reply('**BOA TARRRRDE GENTI**')
        }
    })

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

    command(client, ['eae renatinho', 'oi renatinho'], message => {
        message.channel.send('Oi :)')
    })

    command(client, '157004', message => {
        message.channel.send(
            'Parabéns você descobriu a senha do celular do meu criador!'
        )

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Parabéns ${message.author}`)
            .setTitle(`Você descobriu meu help secreto!`)
            .addFields({
                name: 'Comandos Secretos!',
                value: `> 157004 - abre esse menu!\n> Meu @ - Mostra um menu simples de help\n> kapa - sofra as consequências...`
            })
    })
    command(client, 'kapa', message => {
        message.channel.send('kappa kraio')
    })
    command(client, 'kappa', message => {
        message.channel.send('kappa!')
    })
    command(client, 'capa', message => {
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

    //carregando uns comandos

    loadCommands(client)
    loadFeatures(client)

    messageCount(client)

    tempchannel(client)

    poll(client)
})