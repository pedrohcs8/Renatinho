const Command = require('@util/structures/Command')
const guildSchema = require('@schemas/guild-schema')
const profileSchema = require('@schemas/profile-schema')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = class RegistrarCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'registrar'
    this.category = 'Moderation'
    this.description = 'Comando para registrar membros em seu servidor.'
    this.usage = 'Registrador'
    this.aliases = []

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix }, t) {
    moment.locale('pt-BR')

    const User =
      message.mentions.users.first() || this.client.users.cache.get(args[0])

    if (!User) {
      message.reply('Você deve mecionar a pessoa á ser registrada.')
      return
    }

    const author = await profileSchema.findOne({ userId: message.author.id })

    guildSchema.findOne(
      { idS: message.guild.id },
      async function (err, server) {
        profileSchema.findOne({ userId: User.id }, async function (err, user) {
          if (!user) {
            message.reply(
              `O membro **${User.tag}** não está registrado em minha **Database** no momento`,
            )
            return
          } else if (!message.member.roles.cache.has(server.registrador.role)) {
            message.reply('Você não tem o cargo de registrador!')
            return
          } else if (user.registrador.registred) {
            message.reply('O membro já está registrado!')
            return
          } else {
            message.reply(
              `Você registrou com sucesso o usuário **${
                User.tag
              }** com sucesso! ( **${
                author.registrador.registreds + 1
              } registrados** )`,
            )
            await profileSchema.findOneAndUpdate(
              { userId: message.author.id },
              {
                $set: {
                  'registrador.registreds': author.registrador.registreds + 1,
                },
              },
            )
            await profileSchema.findOneAndUpdate(
              { userId: User.id },
              {
                $set: {
                  'registrador.registredBy': message.author.id,
                  'registrador.registredDate': Date.now(),
                  'registrador.registred': true,
                },
              },
            )
            await guildSchema.findOneAndUpdate(
              { idS: message.guild.id },
              { $set: { 'registrador.total': server.registrador.total + 1 } },
            )
          }
        })
      },
    )
  }
}
