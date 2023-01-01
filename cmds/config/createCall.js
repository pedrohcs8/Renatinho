const Command = require('@util/structures/Command')
const Emojis = require('@util/Emojis')
const { MessageEmbed } = require('discord.js')
const profileSchema = require('@schemas/guild-schema')

module.exports = class createCallCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'createcall'
    this.category = 'Config'
    this.description =
      'Comando para usar o sistema de calls privadas no Servidor'
    this.usage = 'createCall'
    this.aliases = ['callconfig']
    this.subcommands = ['set']
    this.reference = 'createCall'

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const subs =
      args[0] &&
      this.client.subcommands
        .get(this.reference)
        .find(
          (cmd) =>
            cmd.name.toLowerCase() === args[0].toLowerCase() ||
            cmd.aliases.includes(args[0].toLowerCase()),
        )

    let subcmd
    let sub

    if (!subs) {
      sub = 'null'
      this.client.subcommands
        .get(this.reference)
        .find(
          (cmd) =>
            cmd.name.toLowerCase() === sub.toLowerCase() ||
            cmd.aliases.includes(sub.toLowerCase()),
        )
    } else subcmd = subs

    if (subcmd != undefined)
      return subcmd.run({ message, args, prefix, author })

    const doc = await profileSchema.findOne({ idS: message.guild.id })

    const createC = doc.createCall

    const category = message.guild.channels.cache.get(createC.category)
    const voice = message.guild.channels.cache.get(createC.channel)

    const embed = new MessageEmbed()
      .setDescription(
        `> ✨ | ${message.author}, Sistema de calls privadas no servidor.`,
      )
      .addFields(
        {
          name: 'Categoria setada',
          value: !category
            ? 'Nenhuma categoria setada'
            : `**${category.name}**`,
        },
        {
          name: 'Canal de voz setado',
          value: !voice ? 'Nenhum canal setado' : `<#${voice.id}>`,
        },
        {
          name: 'Status',
          value: !createC.status ? 'Desativado' : 'Ativado',
        },
        {
          name: 'Comandos do sistema',
          value: `> **${prefix}createCall list** - Lista as privadas ativas no Servidor.\n> **${prefix}createCall set** - Seta o canal onde as pessoas entram para formar a call privada`,
        },
      )
      .setThumbnail(
        message.guild.iconURL({ dynamic: true, format: 'png', size: 2048 }),
      )

    message.reply({ embeds: [embed] })
  }
}
