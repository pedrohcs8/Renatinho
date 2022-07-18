//Sistema de Logs

const Guild = require('@schemas/guild-schema')
const { MessageEmbed, Message } = require('discord.js')
const Emojis = require('@util/Emojis')
const Command = require('@structures/Command')

module.exports = class Logs extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'logs'
    this.category = 'Config'
    this.description = 'Comando para configurar o canal de logs do servidor'
    this.usage = 'logs <#channel>'
    this.aliases = ['log']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.permissions.has('ADMINISTRATOR' && 'MANAGE_GUILD')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }

    const server = await Guild.findOne({
      idS: message.guild.id,
    })
    const channel =
      message.guild.channels.cache.get((x) => x.id == args[1]) ||
      message.mentions.channels.first()

    if (args[0] == 'set') {
      if (!channel) {
        return message.reply(
          `${Emojis.Errado}, você não inseriu um ID/mencionou um canal para eu setar como canal de logs.`,
        )
      } else if (channel.id == server.logs.channel) {
        return message.reply(
          `${Emojis.Errado}, o canal inserido é o mesmo setado atualmente, tente novamente.`,
        )
      } else {
        message.reply(
          `${Emojis.Certo}, o canal de logs foi alterado para **<#${channel.id}>** com sucesso.`,
        )
        await Guild.findOneAndUpdate(
          { idS: message.guild.id },
          { $set: { 'logs.channel': channel.id } },
        )
      }
      return
    }

    if (args[0] == 'on') {
      if (server.logs.channel == 'null') {
        return message.reply(
          `${Emojis.Errado}, para ativar seu sitema de logs, sete um canal primeiro.`,
        )
      } else if (server.logs.status) {
        return message.reply(
          `${Emojis.Errado} - ${message.author}, o sistema já se encontra ativado.`,
        )
      } else {
        message.reply(`${Emojis.Certo}, sistema ativado com sucesso.`)
        await Guild.findOneAndUpdate(
          { idS: message.guild.id },
          { $set: { 'logs.status': true } },
        )
      }
      return
    }

    if (args[0] == 'off') {
      if (!server.logs.status) {
        return message.reply(
          `${Emojis.Errado}, o sistema já se encontra desativado.`,
        )
      } else {
        message.reply(`${Emojis.Certo}, sistema desativado com sucesso.`)
        await Guild.findOneAndUpdate(
          { idS: message.guild.id },
          { $set: { 'logs.status': false } },
        )
      }
      return
    }

    const HELP = new MessageEmbed()
      .setTimestamp()
      .setFooter(
        `Comando requisitado por ${message.author.username}`,
        message.author.displayAvatarURL({ dynamic: true }),
      )
      .setThumbnail(this.client.user.displayAvatarURL({ size: 2048 }))
      .setAuthor(
        `Sistema de Logs - ${message.guild.name}`,
        this.client.user.displayAvatarURL(),
      )
      .addFields(
        {
          name: `Canal Setado`,
          value:
            server.logs.channel == 'null'
              ? 'Nenhum Canal Setado'
              : `<#${server.logs.channel}>`,
        },
        {
          name: 'Status do Sistema',
          value: `No momento o sistema se encontra **${
            server.logs.status ? `Ativado` : 'Desativado'
          }**`,
        },
      )

    message.reply(message.author, { embeds: [HELP] })
  }
}
