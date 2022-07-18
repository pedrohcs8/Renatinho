const { MessageAttachment, MessageEmbed } = require('discord.js')
const Command = require('@util/structures/Command')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

module.exports = class KissCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'kiss'
    this.category = 'Fun'
    this.description = 'Comando para beijar alguém'
    this.usage = 'kiss <@ da pessoa>'
    this.aliases = ['kiss', 'beijar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!args[0] || !message.mentions.members.first()) {
      message.reply('Mencione alguém para beijar!')
      return
    }
    const target = message.mentions.members.first()
    const { channel } = message

    if (author.id === target.id) {
      message.reply('Você não pode beijar você mesmo')
      return
    }

    const thanks = fs.readFileSync(path.join(__dirname, 'thanks.gif'))
    const attachment2 = new MessageAttachment(thanks, 'thanks.gif')

    if (target.id == '795418788655792129') {
      message.reply(`Valeu!`)
      message.channel.send({ files: [attachment2] })
      return
    }

    const body = await fetch('https://nekos.life/api/v2/img/kiss').then((res) =>
      res.json(),
    )

    const embed = new MessageEmbed()
      .setColor(process.env.EMBED_COLOR)
      .setImage(body.url)
      .setDescription(`${message.author} beijou ${target}`)

    message.reply({ embeds: [embed] })
  }
}
