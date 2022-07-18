const { MessageEmbed, MessageAttachment } = require('discord.js')
const Command = require('@util/structures/Command')
const fetch = require('node-fetch')

module.exports = class McServerCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'mcserver'
    this.category = 'Minecraft'
    this.description = 'Informações de um server de mine.'
    this.usage = 'mcserver <ip do servidor>'
    this.aliases = ['mcserver']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const ip = args[0]

    if (!ip) {
      message.reply(
        'Você deve prover um ip de servidor para ver as informações',
      )
      return
    }

    const [host, port = 25565] = args[0].split(':')
    const server = await fetch(
      `https://mcapi.us/server/status?ip=${host}&port=${port}`,
    ).then((res) => res.json())

    if (server.online) {
      const embed = new MessageEmbed()
        .setTitle('Minecraft Server Status')
        .addFields(
          {
            name: `Status do Servidor`,
            value: server.online ? 'Online' : 'Offline',
          },
          {
            name: 'Players',
            value: `${server.players.now.toLocaleString()}/${server.players.max.toLocaleString()}`,
          },
          {
            name: `IP`,
            value: `${host}:${port}`,
          },
          {
            name: `Versão Mínima/Máxima`,
            value: server.server.name.replace(/§[0-9a-fk-or]/g, ''),
          },
        )
        .attachFiles(
          new MessageAttachment(
            this.ImageBanner(server.favicon),
            'ImageBanner.png',
          ),
        )
        .setImage(`http://status.mclive.eu/${ip}/${ip}/25565/banner.png`)
        .setThumbnail('attachment://ImageBanner.png')

      message.reply({ embeds: [embed] })
    } else {
      message.reply(
        `O servidor do IP: **${ip}** se encontra offline ou não existe!`,
      )
    }
  }

  ImageBanner(str) {
    if (!str) return 'https://i.imgur.com/nZ6nRny.png'
    const matches = str.match(/^data:([A-Za-z-+\/]+);base64,([\s\S]+)/)
    if (!matches || matches.length !== 3) return Buffer.from(str, 'base64')
    return Buffer.from(matches[2], 'base64')
  }
}
