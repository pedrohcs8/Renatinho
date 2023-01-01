//Sistema de AntiInvite

const Command = require('@util/structures/Command')
const { MessageEmbed } = require('discord.js')
const guildSchema = require('@schemas/guild-schema')

module.exports = class AntiInviteCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'antiinvite'
    this.category = 'Config'
    this.description = 'Comando para setar o sistema de anti-invite'
    this.usage = 'antinvite'
    this.aliases = ['antinvite', 'anti-invite', 'antinvite']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.permissions.has('MANAGE_GUILD')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }

    const doc = await guildSchema.findOne({ idS: message.guild.id })

    const anti = doc.antinvite

    const embed = new MessageEmbed()
      .setAuthor(
        `Sistema de Anti Invite`,
        message.guild.iconURL({ dynamic: true })
      )
      .setDescription(
        `> O sistema de Anti-Invite consiste em proibir links de outros servidores em seu servidor.`
      )
      .addFields(
        {
          name: 'Status',
          value: `O sistema se encontra **${
            anti.status ? 'Ativado' : 'Desativado'
          }**`,
        },
        {
          name: `Cargos permitidos: ${anti.roles.length}`,
          value: !anti.roles.length
            ? 'Nenhum cargo'
            : anti.roles.length > 10
            ? anti.roles
                .map((x) => `<@&${x}>`)
                .slice(0, 10)
                .join(' - ')`e mais **${anti.roles.length - 10}** cargos.`
            : anti.roles.map((x) => `<@&${x}>`).join(' - '),
        },
        {
          name: `Canais permitidos: ${anti.channels.length}`,
          value: !anti.channels.length
            ? 'Nenhum canal'
            : anti.channels.length > 10
            ? anti.channels
                .map((x) => `<#${x}>`)
                .slice(0, 10)
                .join(' - ')`e mais **${anti.roles.length - 10}** canais.`
            : anti.channels.map((x) => `<#${x}>`).join(' - '),
        },
        {
          name: 'Mensagem setada',
          value: `${
            anti.msg === 'null'
              ? 'Nenhuma Mensagem Setada'
              : `**\`${anti.msg}\`**`
          }\n\n> **{user}** - Menciona o Membro\n> **{channel}** - Menciona o Canal\n`,
        },
        {
          name: '\nHelpzinho',
          value:
            '> **antiinvite canal** - Para alterar o canal\n> **antiinvite cargos** - Para setar cargos imunes ao sistema\n> **antiinvite msg** para alterar a mensagem após a divulgação ser deletada\n> antiinvite on/off - Liga ou desliga o sistema.',
        }
      )
      .setColor(process.env.EMBED_COLOR)

    if (!args[0]) {
      message.reply({ embeds: [embed] })
      return
    }

    if (['msg', 'message', 'mensagem'].includes(args[0].toLowerCase())) {
      const msg = args.slice(1).join(' ')

      if (!msg) {
        message.reply(`Você não inseriu a mensagem para ser setada no sistema`)
        return
      }

      if (msg.length > 100) {
        message.reply(
          'Você deve inserir uma mensagem de até **100 caracteres**.'
        )
        return
      }

      if (msg === anti.msg) {
        message.reply('A mensagem inserida é igual a atual.')
        return
      }

      message.reply('Mensagem alterada com sucesso!')

      return await guildSchema.findOneAndUpdate(
        { idS: message.guild.id },
        { $set: { 'antinvite.msg': msg } }
      )
    }

    if (['on', 'ligar', 'ativar'].includes(args[0].toLowerCase())) {
      if (anti.status) {
        message.reply('O sistema já se encontra ativado')
      }

      message.reply('O sistema foi ativado com sucesso')

      await guildSchema.findOneAndUpdate(
        { idS: message.guild.id },
        { $set: { 'antinvite.status': true } }
      )

      return
    }

    if (['off', 'desligar', 'desativar'].includes(args[0].toLowerCase())) {
      if (!anti.status) {
        message.reply('O sistema já se encontra desativado')
      }

      message.reply('O sistema foi desativado com sucesso')

      await guildSchema.findOneAndUpdate(
        { idS: message.guild.id },
        { $set: { 'antinvite.status': false } }
      )

      return
    }

    if (['cargos', 'roles', 'cargos'].includes(args[0].toLowerCase())) {
      const role =
        message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

      if (!role) {
        message.reply(
          'Você deve inserir o ID/@(Menção) do cargo que deseja adicionar no sistema de Anti-Invite'
        )
        return
      }

      if (anti.roles.some((x) => x === role.id)) {
        return message
          .reply('O cargo inserido já estava na lista portanto removi ele')
          .then(async () => {
            await guildSchema.findOneAndUpdate(
              {
                idS: message.guild.id,
              },
              { $pull: { 'antinvite.roles': role.id } }
            )
          })
      }

      if (anti.roles.length >= 15) {
        message.reply(
          'Você chegou ao máximo de 15 cargos no sistema de Anti-Invite!'
        )
        return
      }

      message.reply('Cargo inserido com sucesso.')

      return await guildSchema.findOneAndUpdate(
        { idS: message.guild.id },
        { $push: { 'antinvite.roles': role.id } }
      )
    }
    if (
      ['canais', 'channel', 'canal', 'channels'].includes(args[0].toLowerCase())
    ) {
      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1])

      if (!channel) {
        message.reply(
          'Você deve inserir o ID/@(Menção) do cargo que deseja adicionar no sistema de Anti-Invite'
        )
        return
      }

      if (anti.channels.some((x) => x === role.id)) {
        return message
          .reply('O canal inserido já estava na lista portanto removi ele')
          .then(async () => {
            await guildSchema.findOneAndUpdate(
              {
                idS: message.guild.id,
              },
              { $pull: { 'antinvite.channels': role.id } }
            )
          })
      }

      if (anti.channels.length >= 15) {
        message.reply(
          'Você chegou ao máximo de 15 cargos no sistema de Anti-Invite!'
        )
        return
      }

      message.reply('Cargo inserido com sucesso.')

      return await guildSchema.findOneAndUpdate(
        { idS: message.guild.id },
        { $push: { 'antinvite.channels': role.id } }
      )
    }
  }
}
