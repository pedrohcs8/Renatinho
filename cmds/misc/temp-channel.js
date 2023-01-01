const Command = require('@util/structures/Command')
const tempChannelSchema = require('@schemas/temp-channels-schema')

module.exports = class TempChannelCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'tempchannel'
    this.category = 'Moderation'
    this.description = 'Comando para criar um chat temporário'
    this.usage = 'tempchannel'
    this.aliases = ['tempchannel', 'tempc']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }
    const { guild, member } = message
    const guildId = guild.id
    const memberId = member.id

    const results = await tempChannelSchema.findOne({
      guildId,
      memberId,
    })

    if (results) {
      message.reply('Você já tem um canal temporário.')
      return
    }

    message.reply('Você foi marcado em um canal, por favor cheque.')

    const role = guild.roles.cache.find((role) => {
      return role.name === '@everyone'
    })

    const newChannel = await guild.channels.create('Formulário', {
      parent: '770104824100028446', // Community category
      permissionOverwrites: [
        {
          id: role.id, // Everyone role
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: memberId,
          allow: ['VIEW_CHANNEL'],
        },
      ],
    })

    newChannel.send(
      `Olá <@${memberId}> mande .formadm para concluir seu formulário. Esse canal será excluído em 15 minutos`
    )

    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)

    await new tempChannelSchema({
      guildId,
      channelId: newChannel.id,
      userId: memberId,
      expires,
    }).save()
  }
}
