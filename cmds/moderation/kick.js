const Command = require('@util/structures/Command')
const infractionsSchema = require('@schemas/infractions-schema')
const { MessageEmbed } = require('discord.js')

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'kick'
    this.category = 'Moderation'
    this.description = 'Comando para kickar alguém'
    this.usage = 'kick <@ da pessoa>'
    this.aliases = ['expulsar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const { guild, member } = message

    if (
      !message.member.permissions.has('ADMINISTRATOR') ||
      !message.member.permissions.has('KICK_MEMBERS')
    ) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }

    const tag = `<@${member.id}>`
    const target = message.mentions.users.first()

    if (target.id == '795418788655792129') {
      message.reply('**Você não pode kickar o pedro!**')
      return
    }

    const reason = !args[1] ? 'Não especificado' : args[1]

    if (target) {
      const targetMember = message.guild.members.cache.get(target.id)
      targetMember.kick({ reason: !reason ? '' : reason })
      message.reply(`O usuário ${target} foi kickado`)
    } else {
      message.reply(`${tag} Especifique alguém para kikar.`)
      return
    }

    infractionsSchema.findOne(
      { guildId: guild.id, userId: target.id },
      async (err, data) => {
        if (err) throw err

        if (!data || !data.banData) {
          data = new infractionsSchema({
            guildId: guild.id,
            userId: target.id,
            kickData: [
              {
                executerId: member.id,
                executerTag: member.user.tag,
                targetId: target.id,
                targetTag: target.tag,
                reason: reason,
                date: parseInt(message.createdTimestamp / 1000),
              },
            ],
          })
        } else {
          const KickDataObject = {
            executerId: member.id,
            executerTag: member.user.tag,
            targetId: target.id,
            targetTag: target.tag,
            reason: reason,
            date: parseInt(message.createdTimestamp / 1000),
          }
          data.kickData.push(KickDataObject)
        }
        data.save()
      },
    )
  }
}
