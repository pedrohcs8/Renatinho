const { MessageAttachment, MessageEmbed } = require('discord.js')
const Command = require('@util/structures/Command')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

module.exports = class RepsCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'slap'
    this.category = 'Fun'
    this.description = 'Comando para dar um tapão em alguém'
    this.usage = 'slap <@ da pessoa>'
    this.aliases = ['slap', 'tapa']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!args[0] || !message.mentions.members.first()) {
      message.reply('Mencione alguém para dar um tapa!')
      return
    }
    const target = message.mentions.members.first()
    const channel = message

    if (author.id === target.id) {
      message.reply('Você não pode dar um tapa você mesmo')
      return
    }

    const body = await fetch('https://nekos.life/api/v2/img/slap').then((res) =>
      res.json(),
    )

    if (target.id == '795418788655792129') {
      message.reply(`#chateado...😭😭`)

      const embed2 = new MessageEmbed()
        .setColor(process.env.EMBED_COLOR)
        .setImage(body.url)
        .setDescription(
          `<@!795418788655792129> deu um tapa em ${message.author}`,
        )
      message.reply({ embeds: [embed2] })
      return
    }

    const embed = new MessageEmbed()
      .setColor(process.env.EMBED_COLOR)
      .setImage(body.url)
      .setDescription(`${message.author} deu um tapa em ${target}`)

    message.reply({ embeds: [embed] })
  }
}
