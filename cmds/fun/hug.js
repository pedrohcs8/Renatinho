const { MessageAttachment, MessageEmbed } = require('discord.js')
const Command = require('@util/structures/Command')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

module.exports = class HugCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'hug'
    this.category = 'Fun'
    this.description = 'Comando para abraçar alguém'
    this.usage = 'hug <@ da pessoa>'
    this.aliases = ['hug', 'abraçar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!args[0] || !message.mentions.members.first()) {
      message.reply('Mencione alguém para abraçar!')
      return
    }
    const target = message.mentions.members.first()

    if (message.author.id === target.id) {
      message.reply('Você não pode abraçar você mesmo')
      return
    }

    const thanks = fs.readFileSync(path.join(__dirname, 'thanks.gif'))
    const attachment2 = new MessageAttachment(thanks, 'thanks.gif')

    if (target.id == '795418788655792129') {
      message.reply(`Valeu!`)
      message.channel.send({ files: [attachment2] })
      return
    }

    const body = await fetch('https://nekos.life/api/v2/img/hug').then((res) =>
      res.json(),
    )

    const embed = new MessageEmbed()
      .setColor(process.env.EMBED_COLOR)
      .setImage(body.url)
      .setDescription(`${message.author} abraçou ${target}`)

    message.reply({ embeds: [embed] })
  }
}
