//Sistema de AutoRole

const Command = require('@util/structures/Command')
const { MessageEmbed } = require('discord.js')
const Guild = require('@schemas/guild-schema')

module.exports = class AutoRoleCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'autorole'
    this.category = 'Config'
    this.description = 'Comando para setar o sistema de autorole'
    this.usage = 'autorole'
    this.aliases = ['autorole']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    Guild.findOne({ idS: message.guild.id }, async (err, server) => {
      if (!message.member.permissions.has('ADMINISTRATOR' && 'MANAGE_GUILD')) {
        message.reply('Você não tem permissão para usar esse comando.')
        return
      }

      const autorole = server.autorole
      const role =
        message.guild.roles.cache.get(args[0]) || message.mentions.roles.first()

      if (!args[0]) {
        const help = new MessageEmbed()
          .setAuthor(
            `${message.guild.name} - Sistema de AutoRole`,
            message.guild.iconURL({ dynamic: true }),
          )
          .addFields(
            {
              name: 'Cargos setados atualmente',
              value: !autorole.roles.length
                ? 'Nenhum Cargo'
                : `${autorole.roles.map((x) => `<@&${x}>`).join(', ')} **[${
                    autorole.roles.length
                  }]**`,
            },
            {
              name: 'Status do sistema',
              value: `No momento o sistema se encontra **${
                autorole.status ? 'Ativado' : 'Desativado'
              }**`,
            },
            {
              name: 'Ajuda',
              value: `> **.autorole add <cargo>** - Adiciona um cargo;\n> **.autorole remove <cargo/all>** - Remove um cargo;\n> **.autorole list** - Lista os cargos;\n> **.autorole <on/off>** - Ativa/Desativa o sistema`,
            },
          )

        message.reply({ embeds: [help] })
        return
      }

      if (['add', 'adicionar'].includes(args[0].toLowerCase())) {
        if (!role) {
          message.reply(
            'Você deve mecionar ou inserir o ID do cargo que deseja setar no AutoRole.',
          )
          return
        } else if (autorole.roles.length > 5) {
          message.reply(
            'O limite de cargos no autorole é **5** e você já alcançou esse limite, não é possível adicionar mais cargos.',
          )
          return
        } else if (autorole.roles.find((x) => x === role.id)) {
          message.reply(`Esse cargo já está no sistema`)
          return
        } else {
          message.reply(
            `O cargo foi adicionado no sistema de AutoRole com sucesso.`,
          )
          await Guild.findOneAndUpdate(
            { idS: message.guild.id },
            { $push: { 'autorole.roles': role.id } },
          )
        }
        return
      }

      if (['remove', 'remover'].includes(args[0].toLowerCase())) {
        if (args[1] == 'all') {
          if (!autorole.roles.length) {
            message.reply('Não há nenhum cargo no sistema.')
            return
          } else {
            message.reply(
              'Todos os cargos foram removidos do sistema de AutoRole com sucesso.',
            )
            await Guild.findOneAndUpdate(
              { idS: message.guild.id },
              { $set: { 'autorole.roles': [], 'autorole.status': false } },
            )
            return
          }
        }
        if (!role) {
          message.reply(
            'Você deve mecionar ou inserir o ID do cargo que deseja retirar do AutoRole.',
          )
          return
        } else if (!autorole.roles.length) {
          message.reply('Não há nenhum cargo no sistema.')
          return
        } else if (!autorole.roles.find((x) => x === role.id)) {
          message.reply(`Esse cargo não está no sistema`)
          return
        } else {
          message.reply(
            `O cargo foi removido no sistema de AutoRole com sucesso.`,
          )
          await Guild.findOneAndUpdate(
            { idS: message.guild.id },
            { $pull: { 'autorole.roles': role.id } },
          )
        }
        return
      }

      if (['list', 'lista'].includes(args[0].toLowerCase())) {
        if (!autorole.roles.length) {
          message.reply('Não há nenhum cargo no sistema.')
          return
        } else {
          const embed = new MessageEmbed()
            .setAuthor(
              'Lista dos cargos no sistema de AutoRole',
              message.guild.iconURL({ dynamic: true }),
            )
            .setDescription(autorole.roles.map((x) => `<@&${x}>`).join('\n'))

          message.reply(embed)
        }
      }

      if (['on', 'ligar'].includes(args[0].toLowerCase())) {
        if (autorole.status) {
          message.reply('O sistema já se encontra ligado')
          return
        }
        if (!autorole.roles.length) {
          message.reply(
            'Não há nenhum cargo no sistema, por isso não é possível ligar o sistema',
          )
          return
        } else {
          message.reply('Sistema ligado com sucesso.')
          await Guild.findOneAndUpdate(
            { idS: message.guild.id },
            { $set: { 'autorole.status': true } },
          )
        }
      }
      if (['off', 'desligar'].includes(args[0].toLowerCase())) {
        if (!autorole.status) {
          message.reply('O sistema já se encontra desligado')
          return
        } else {
          message.reply('Sistema desligado com sucesso.')
          await Guild.findOneAndUpdate(
            { idS: message.guild.id },
            { $set: { 'autorole.status': false } },
          )
        }
      }
    })
  }
}
