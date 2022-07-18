const Command = require('@structures/Command')
const ms = require('ms')
const infractionsSchema = require('@schemas/infractions-schema')
const { MessageEmbed } = require('discord.js')

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'mute'
    this.category = 'Moderation'
    this.description = 'Comando para mutar alguém'
    this.usage =
      'mute <@ da pessoa> <tempo (m (minutos) h (horas) d (dias))> <razão>'
    this.aliases = ['mute']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const { guild, member } = message

    if (!message.member.permissions.has('MUTE_MEMBERS')) {
      message.reply(
        `${message.author}, você precisa da permissão de **Mutar Membros* para executar este comando.`,
      )
      return
    }

    const mention = message.mentions.users.first().id
    const target = message.guild.members.cache.get(mention)
    const length = args.length
    const reason = args.slice(2, length).join(' ') || 'Não especificado'
    const duration = args[1]
    const MutedRole = '805508210302779422'
    const mute = guild.roles.cache.get(MutedRole)

    const embed = new MessageEmbed()
      .setColor(process.env.EMBED_COLOR)
      .setAuthor('Sistema de Mute', guild.iconURL({ dynamic: true }))

    if (target.id === member.id) {
      message.reply('❌ - Você não pode se mutar.')
      return
    }

    if (target.roles.highest.position > member.roles.highest.position) {
      message.reply(
        '❌ - Você não pode mutar alguém com o cargo superior ao seu.',
      )
      return
    }

    if (!mute) {
      message.reply('❌ - O cargo de pessoa mutada não foi encontrado.')
      return
    }

    infractionsSchema.findOne(
      { guildId: guild.id, userId: target.id },
      async (err, data) => {
        if (err) throw err
        if (!data) {
          data = new infractionsSchema({
            guildId: guild.id,
            userId: target.id,
            muteData: [
              {
                executerId: member.id,
                executerTag: member.tag,
                targetId: target.id,
                targetTag: target.tag,
                reason: reason,
                duration: duration,
                date: parseInt(message.createdTimestamp / 1000),
              },
            ],
          })
        } else {
          const newMuteObject = {
            executerId: member.id,
            executerTag: member.tag,
            targetId: target.id,
            targetTag: target.tag,
            reason: reason,
            duration: duration,
            date: parseInt(message.createdTimestamp / 1000),
          }
          data.muteData.push(newMuteObject)
        }
        data.save()
      },
    )

    target.send({
      embeds: [
        new MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setAuthor('Sistema de Mutes', guild.iconURL({ dynamic: true }))
          .setDescription(
            `Você foi mutado por ${member} em **${guild.name}**\nRazão: ${reason}\nDuração: ${duration}`,
          ),
      ],
    })

    await target.roles.add(mute.id)
    setTimeout(async () => {
      if (!target.roles.cache.get(mute.id)) return
      await target.roles.remove(mute)
    }, ms(duration))

    embed.setDescription(
      `Membro ${target} | \`${target.id}\` foi mutado!\nStaff: ${member} | \`${member.id}\`\nDuração: \`${duration}\`\nRazão: \`${reason}\``,
    )
    message.reply({ embeds: [embed] })
  }
}
