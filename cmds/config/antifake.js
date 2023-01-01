//Sistema de AntiFake

const Command = require('@util/structures/Command')
const { MessageEmbed } = require('discord.js')
const Guild = require('@schemas/guild-schema')

module.exports = class AntiFakeCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'antifake'
    this.category = 'Config'
    this.description = 'Comando para setar o sistema de antifake'
    this.usage = 'antifake'
    this.aliases = ['antifake', 'ant-f', 'af']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const doc = await Guild.findOne({ idS: message.guild.id })

    if (!message.member.permissions.has('ADMINISTRATOR' && 'MANAGE_GUILD')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }

    const anti = doc.antifake

    const embed = new MessageEmbed()
      .setAuthor(
        `${message.guild.name} | AntiFake`,
        message.guild.iconURL({ dynamic: true }),
      )
      .addFields(
        {
          name: 'Status do sistema',
          value: `O sistema se encontra **${
            !anti.status ? 'Desativado' : 'Ativado'
          }**`,
        },
        {
          name: 'Dias de criação da conta para kickar',
          value: anti.days <= 0 ? 'Não inserido' : `${anti.days} dias.`,
        },
      )

    if (!args[0]) {
      message.reply({ embeds: [embed] })
      return
    }

    if (['days', 'dias'].includes(args[0].toLowerCase())) {
      const days = parseInt(args[1])

      if (!args[1] || isNaN(args[1])) {
        message.reply(
          `Insira quantos dias deseja que eu kicke contas com um tempo de criação menor que o setado.`,
        )
        return
      }

      if (days < 1 || days > 30) {
        message.reply(
          `Você não pode inserir datas maiores que 30 e menores que 1.`,
        )
        return
      }

      if (anti.days === days) {
        message.reply(`A quantidade de dias inserido é igual a atual.`)
        return
      }

      message.reply(`Quantidade de dias alterado com sucesso!`)

      await Guild.findOneAndUpdate(
        { idS: message.guild.id },
        { $set: { 'antifake.days': days } },
      )
      return
    }

    if (['on', 'ligar', 'ativar'].includes(args[0].toLowerCase())) {
      if (anti.days <= 1) {
        message.reply(
          'Não é possível ligar o sistema pois a quantidade de dias não foi setada!',
        )
        return
      }

      if (anti.status) {
        message.reply(`O sistema já se encontra ativado.`)
        return
      }

      message.reply(`Sistema de AntiFake ativado com sucesso!`)

      await Guild.findOneAndUpdate(
        { idS: message.guild.id },
        { $set: { 'antifake.status': true } },
      )
      return
    }
    if (['off', 'desligar', 'desativar'].includes(args[0].toLowerCase())) {
      if (!anti.status) {
        message.reply(`O sistema já se encontra desativado.`)
        return
      }

      message.reply(`Sistema de AntiFake desativado com sucesso!`)

      await Guild.findOneAndUpdate(
        { idS: message.guild.id },
        { $set: { 'antifake.status': false } },
      )
      return
    }
  }
}
