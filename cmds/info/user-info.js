//Informações do usuário
const Command = require('@util/structures/Command')
const { MessageEmbed } = require('discord.js')
const Emojis = require('@util/Emojis')
const moment = require('moment')

module.exports = class UserInfo extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'user-info'
    this.category = 'Info'
    this.description = 'Informações da conta de alguém.'
    this.usage = 'userinfo'
    this.aliases = ['userinfo']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    moment.locale('pt-BR')

    const { guild } = message

    const user = message.author

    let flags = []
    this.Flags(user, flags)

    let roles = []
    this.Roles(user, roles, message)

    let presence
    if (!message.member.presence.activities.length)
      presence = 'Não está jogando nada'
    else presence = message.member.presence.activities.join(', ')

    const member = guild.members.cache.get(user.id)

    const device = this.Device(message)
    const joined = `${moment(member.joinedTimestamp).format('L')} ( ${moment(
      member.joinedTimestamp,
    )
      .startOf('day')
      .fromNow()} )`
    const created = `${moment(
      this.client.users.cache.get(user.id).createdAt,
    ).format('L')} ( ${moment(this.client.users.cache.get(user.id).createdAt)
      .startOf('day')
      .fromNow()} )`

    const embed = new MessageEmbed()
      .setTitle(user.username + `\n${flags}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: 'Jogando/Escutando Agora',
          value: `\`\`\`diff\n- ${presence}\`\`\``,
        },
        {
          name: 'Nome de Usuário',
          value: user.tag,
          inline: true,
        },
        {
          name: 'Nickname no Server',
          value: !!user.nickname ? user.nickname : 'Nenhum nickname',
          inline: true,
        },
        {
          name: 'Id do Usuário',
          value: user.id,
          inline: true,
        },
        {
          name: 'Conta criada:',
          value: created.toString(),
          inline: true,
        },
        {
          name: 'Entrou no servidor',
          value: joined.toString(),
          inline: true,
        },
        {
          name: 'Plataforma',
          value: String(device)
            .replace('null', 'Nenhum')
            .replace('undefined', `${Emojis.Robot}`),
          inline: true,
        },
        {
          name: 'É bot?',
          value: user.bot ? 'Sim' : 'Não',
        },
        {
          name: `Cargos:`,
          value: roles.toString(),
        },
      )

    message.reply({ embeds: [embed] })
  }

  Flags(user, flags) {
    let list
    if (this.client.users.cache.get(user.id).flags == null) {
      list = ''
    } else {
      list = this.client.users.cache
        .get(user.id)
        .flags.toArray()
        .join('')
        .replace('EARLY_VERIFIED_DEVELOPER', Emojis.Verified_Developer)
        .replace('HOUSE_BRAVERY', Emojis.Bravery)
        .replace('HOUSE_BRILLIANCE', Emojis.Brilliance)
        .replace('HOUSE_BALANCE', Emojis.Balance)
        .replace('VERIFIED_BOT', Emojis.Verified_Bot)
        .replace('VERIFIED_DEVELOPER', Emojis.Verified_Developer)

      flags.push(list)
    }
  }

  Device(message) {
    if (!message.member.presence.clientStatus) {
      return
    }
    let devices = Object.keys(message.member.presence.clientStatus)

    let deviceList = devices.map((x) => {
      if (x === 'desktop') {
        return `${Emojis.Computer}`
      } else if (x === 'mobile') {
        return `${Emojis.Mobile}`
      } else {
        return `${Emojis.Robot}`
      }
    })

    return deviceList.join(' - ')
  }

  Roles(user, roles, message) {
    const ROLES = message.guild.members.cache
      .get(user.id)
      .roles.cache.filter((r) => r.id !== message.guild.id)
      .map((roles) => roles)
    let list
    if (!ROLES.length) list = 'Nenhum Cargo'
    else
      list =
        ROLES.length > 10
          ? ROLES.map((r) => r)
              .slice(0, 10)
              .join(', ') + `e mais **${ROLES.length - 10}** cargos.`
          : ROLES.map((r) => r).join(', ')

    roles.push(list)
  }
}
