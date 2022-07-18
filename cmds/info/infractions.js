const Command = require('@util/structures/Command')
const infractionsSchema = require('@schemas/infractions-schema')
const { MessageEmbed } = require('discord.js')

module.exports = class CheckInfractionsCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'infractions'
    this.category = 'Info'
    this.description = 'Comando para ver as punições de um usuário'
    this.usage =
      'checkinfractions <@ da pessoa> <tipo (all, warnings, bans, kicks, mutes, reports)>'
    this.aliases = ['checkinfractions']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const target = message.mentions.users.first()
    const type = args[1].toLowerCase()

    if (!message.member.permissions.has('ADMINISTRATOR')) {
      message.reply(
        `${message.author}, você precisa da permissão de **Mutar Membros* para executar este comando.`,
      )
      return
    }

    const { guild, member } = message

    const embed = new MessageEmbed()
      .setColor(process.env.EMBED_COLOR)
      .setAuthor('Sistema de Infrações', guild.iconURL({ dynamic: true }))

    switch (type) {
      case 'all':
        {
          infractionsSchema.findOne(
            { guildId: guild.id, userId: target.id },
            async (err, data) => {
              if (err) throw err
              if (data) {
                const w = data.warnData.length
                const r = data.reportData.length
                const b = data.banData.length
                const k = data.kickData.length
                const m = data.muteData.length

                embed.setDescription(
                  `Membro: ${target} | ||${target.id}||\nWarns: ${w}\nReports: ${r}\nBans: ${b}\nKicks: ${k}\nMutes: ${m}`,
                )
                message.reply({ embeds: [embed] })
              } else {
                embed.setDescription(
                  `${target} não tem nenhuma infração computada!`,
                )
                message.reply({ embeds: [embed] })
              }
            },
          )
        }
        break
      case 'warnings':
        {
          infractionsSchema.findOne(
            { guildId: guild.id, userId: target.id },
            async (err, data) => {
              if (err) throw err
              if (data) {
                if (data.warnData.length < 1) {
                  embed.setDescription(`${target} não tem nenhum warn.`)
                  message.reply({ embeds: [embed] })
                }
                embed.setDescription(
                  `${target} | ||${target.id}|| warnings\n\n` +
                    `${data.warnData
                      .map(
                        (w, i) =>
                          `Id: ${i + 1}\nData: <t:${parseInt(
                            w.date,
                          )}:R>\nStaff: <@${w.executerId}>\nRazão: ${
                            w.reason
                          }\n\n`,
                      )
                      .join(' ')
                      .slice(0, 4000)}`,
                )
                message.reply({ embeds: [embed] })
              } else {
                embed.setDescription(`${target} não tem nenhum warn.`)
                message.reply({ embeds: [embed] })
              }
            },
          )
        }
        break
      case 'bans':
        {
          infractionsSchema.findOne(
            { guildId: guild.id, userId: target.id },
            async (err, data) => {
              if (err) throw err
              if (data) {
                if (data.banData.length < 1) {
                  embed.setDescription(`${target} não tem nenhum ban.`)
                  message.reply({ embeds: [embed] })
                  return
                }
                embed.setDescription(
                  `${target} | ||${target.id}|| bans\n\n` +
                    `${data.banData
                      .map(
                        (w, i) =>
                          `Id: ${i + 1}\nData: <t:${parseInt(
                            w.date,
                          )}:R>\nStaff: <@${w.executerId}>\nRazão: ${
                            w.reason
                          }\nMensagens deletadas em ${w.messages} dias\n\n`,
                      )
                      .join(' ')
                      .slice(0, 4000)}`,
                )
                message.reply({ embeds: [embed] })
              } else {
                embed.setDescription(`${target} não tem nenhum ban.`)
                message.reply({ embeds: [embed] })
              }
            },
          )
        }
        break
      case 'kicks':
        {
          infractionsSchema.findOne(
            { guildId: guild.id, userId: target.id },
            async (err, data) => {
              if (err) throw err
              if (data) {
                if (data.kickData.length < 1) {
                  embed.setDescription(`${target} não tem nenhum kick.`)
                  message.reply({ embeds: [embed] })
                  return
                }
                embed.setDescription(
                  `${target} | ||${target.id}|| bans\n\n` +
                    `${data.kickData
                      .map(
                        (w, i) =>
                          `Id: ${i + 1}\nData: <t:${parseInt(
                            w.date,
                          )}:R>\nStaff: <@${w.executerId}>\nRazão: ${
                            w.reason
                          }\n\n`,
                      )
                      .join(' ')
                      .slice(0, 4000)}`,
                )
                message.reply({ embeds: [embed] })
              } else {
                embed.setDescription(`${target} não tem nenhum kick.`)
                message.reply({ embeds: [embed] })
              }
            },
          )
        }
        break
      case 'mutes':
        {
          infractionsSchema.findOne(
            { guildId: guild.id, userId: target.id },
            async (err, data) => {
              if (err) throw err
              if (data) {
                if (data.muteData.length < 1) {
                  embed.setDescription(`${target} não tem nenhum mute.`)
                  message.reply({ embeds: [embed] })
                  return
                }
                embed.setDescription(
                  `${target} | ||${target.id}|| mutes\n\n` +
                    `${data.muteData
                      .map(
                        (w, i) =>
                          `Id: ${i + 1}\nData: <t:${parseInt(
                            w.date,
                          )}:R>\nStaff: <@${w.executerId}>\nRazão: ${
                            w.reason
                          }\nDuração: ${w.duration}\n\n`,
                      )
                      .join(' ')
                      .slice(0, 4000)}`,
                )
                message.reply({ embeds: [embed] })
              } else {
                embed.setDescription(`${target} não tem nenhum mute.`)
                message.reply({ embeds: [embed] })
              }
            },
          )
        }
        break
    }
  }
}
