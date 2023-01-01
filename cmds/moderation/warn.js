const Command = require('@structures/Command')

const warnSchema = require('@schemas/warning-schema')
const infractionsSchema = require('@schemas/infractions-schema')
const { MessageEmbed } = require('discord.js')
const warningSchema = require('../../schemas/warning-schema')

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'warn'
    this.category = 'Moderation'
    this.description = 'Comando para avisar alguém'
    this.usage = 'warn'
    this.aliases = ['avisar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }

    if (!args[0]) {
      const embed = new MessageEmbed()
        .setTitle('Warn | Help')
        .setDescription(
          '> **warn add <@ da pessoa> [Razão] | Adiciona um aviso na pessoa** \n> **warn check <@ da pessoa> | Mostra todos os avisos da pessoa**\n> **warn remove <@ da pessoa> <Id do aviso> | Remove o aviso do id da pessoa**\n> **warn clear <@ da pessoa> | Remove todos os avisos da pessoa**',
        )
        .setColor(process.env.EMBED_COLOR)

      message.reply({ embeds: [embed] })
      return
    }

    const warnDate = parseInt(message.createdTimestamp / 1000)
    const target = message.mentions.users.first()
    const { guild, member } = message

    if (!target) {
      message.reply('Você deve mecionar a pessoa alvo.')
      return
    }

    if (['add'].includes(args[0].toLowerCase())) {
      const length = args.length
      const reason = args.slice(2, length).join(' ') || 'Não especificado'
      warnSchema.findOne(
        {
          guildId: message.guild.id,
          userId: target.id,
          userTag: target.tag,
        },
        async (err, data) => {
          if (err) throw err
          if (!data) {
            data = new warnSchema({
              guildId: message.guild.id,
              userId: target.id,
              userTag: target.tag,
              content: [
                {
                  executerId: message.author.id,
                  executertag: message.author.tag,
                  reason: reason,
                  date: warnDate,
                },
              ],
            })
          } else {
            const obj = {
              executerId: message.author.id,
              executertag: message.author.tag,
              reason: reason,
              date: warnDate,
            }
            data.content.push(obj)
          }
          data.save()
        },
      )

      infractionsSchema.findOne(
        { guildId: guild.id, userId: target.id },
        async (err, data) => {
          if (err) throw err
          if (!data) {
            data = new infractionsSchema({
              guildId: guild.id,
              userId: target.id,
              warnData: [
                {
                  executerId: message.author.id,
                  executertag: message.author.tag,
                  reason: reason,
                  date: warnDate,
                },
              ],
            })
          } else {
            const newWarnObject = {
              executerId: message.author.id,
              executertag: message.author.tag,
              reason: reason,
              date: warnDate,
            }
            data.warnData.push(newWarnObject)
          }
          data.save()
        },
      )

      const embed = new MessageEmbed()
        .setTitle('Sistema de Warn')
        .setColor('RANDOM')
        .setDescription(
          `Aviso adicionado: ${target.tag} | ||${target.id}||\n**Razão**: ${reason}`,
        )

      message.reply({ embeds: [embed] })

      return
    }

    if (['check'].includes(args[0].toLowerCase())) {
      warnSchema.findOne(
        {
          guildId: message.guild.id,
          userId: target.id,
          userTag: target.tag,
        },
        async (err, data) => {
          if (err) throw err
          if (data) {
            const embed = new MessageEmbed()
              .setTitle('Sistema de Warn')
              .setColor('RANDOM')
              .setDescription(
                `${data.content
                  .map(
                    (w, i) =>
                      `**ID**: ${i + 1}\n**Por**: ${w.executertag}\n**Data**: ${
                        w.date
                      }\n**Razão**: ${w.reason}`,
                  )
                  .join(`\n\n`)}`,
              )

            message.reply({ embeds: [embed] })
            return
          } else {
            message.reply('Este usuário não tem nenhum aviso!')
            return
          }
        },
      )

      return
    }

    if (['remove'].includes(args[0].toLowerCase())) {
      if (!args[2]) {
        message.reply('Você deve prover um id de aviso.')
        return
      }
      const warnId = parseInt(args[2]) - 1
      warningSchema.findOne(
        {
          guildId: message.guild.id,
          userId: target.id,
          userTag: target.tag,
        },
        async (err, data) => {
          if (err) throw err
          if (data) {
            data.content.splice(warnId, 1)

            const embed = new MessageEmbed()
              .setTitle('Sistema de Warn')
              .setColor('RANDOM')
              .setDescription(
                `O aviso de ${target.tag} foi removido (Id:${warnId + 1})`,
              )

            message.reply({ embeds: [embed] })

            data.save()
          } else {
            const embed = new MessageEmbed()
              .setTitle('Sistema de Warn')
              .setColor('RANDOM')
              .setDescription(`${target.tag} não tem avisos.`)

            message.reply({ embeds: [embed] })
          }
        },
      )
      return
    }

    if (['clear'].includes(args[0].toLowerCase())) {
      warningSchema.findOne(
        warnSchema.findOne(
          {
            guildId: message.guild.id,
            userId: target.id,
            userTag: target.tag,
          },
          async (err, data) => {
            if (err) throw err
            if (data) {
              await warningSchema.findOneAndDelete({
                guildId: message.guild.id,
                userId: target.id,
                userTag: target.tag,
              })

              const embed = new MessageEmbed()
                .setTitle('Sistema de Warn')
                .setColor('RANDOM')
                .setDescription(
                  `Todos os avisos de ${target.tag} foram deletados.`,
                )

              message.reply({ embeds: [embed] })
            } else {
              const embed = new MessageEmbed()
                .setTitle('Sistema de Warn')
                .setColor('RANDOM')
                .setDescription(`${target.tag} não tem avisos.`)

              message.reply({ embeds: [embed] })
            }
          },
        ),
      )
      return
    }
  }
}
