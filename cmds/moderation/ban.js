const Command = require('@util/structures/Command')
const { MessageEmbed } = require('discord.js')
const infractionsSchema = require('@schemas/infractions-schema')

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'ban'
    this.category = 'Moderation'
    this.description = 'Comando para banir alguém'
    this.usage =
      'kick <@ da pessoa> [Quantidade de dias para excluir suas mensagens] [Razão]'
    this.aliases = ['banir']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const { guild, member } = message
    const amount = args[1] || 0

    if (!message.member.permissions.has('BAN_MEMBERS')) {
      message.reply(
        `${message.author}, você precisa da permissão de **Banir Membros* para executar este comando.`,
      )
      return
    }

    const mention = message.mentions.users.first().id
    const target = message.guild.members.cache.get(mention)
    const length = args.length
    const reason = args.slice(2, length).join(' ') || 'Não especificado'

    const embed = new MessageEmbed()
      .setColor(process.env.EMBED_COLOR)
      .setAuthor('Sistema de Bans', guild.iconURL())

    if (target.id === message.id) {
      message.reply('❌ - Você não pode banir você mesmo!')
      return
    }

    if (target == '795418788655792129') {
      message.reply('**Você não pode banir o pedro!**')
      return
    }

    if (target.roles.highest.position > member.roles.highest.position) {
      message.reply(
        '❌ - Você não pode banir uma pessoa com o cargo maior que o seu!',
      )
      return
    }

    if (amount > 7) {
      message.reply(
        'A quantidade de dias para excluir todas as mensagens do membro não pode exeder (0-7).',
      )
      return
    }

    target
      .send({
        embeds: [
          new MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setAuthor('Sistema de Bans', guild.iconURL())
            .setDescription(`Você foi banido por ${reason}.`),
        ],
      })
      .catch(() => {
        console.log(
          `Não consegui mandar a mensagem de ban para o usuário ${target.tag}`,
        )
      })

    embed.setDescription(`O usuário ${target} foi banido por \`${reason}\``)
    message.reply({ embeds: [embed] })

    infractionsSchema.findOne(
      { guildId: guild.id, userId: target.id },
      async (err, data) => {
        if (err) throw err

        if (!data || !data.banData) {
          data = new infractionsSchema({
            guildId: guild.id,
            userId: target.id,
            banData: [
              {
                executerId: member.id,
                executerTag: member.user.tag,
                targetId: target.id,
                targetTag: target.tag,
                messages: amount,
                reason: reason,
                date: parseInt(message.createdTimestamp / 1000),
              },
            ],
          })
        } else {
          const BanDataObject = {
            executerId: member.id,
            executerTag: member.user.tag,
            targetId: target.id,
            targetTag: target.tag,
            messages: amount,
            reason: reason,
            date: parseInt(message.createdTimestamp / 1000),
          }
          data.banData.push(BanDataObject)
        }
        data.save()
      },
    )

    target.ban({ days: amount, reason: reason }).catch((err) => {
      console.log(err)
    })
  }
}
