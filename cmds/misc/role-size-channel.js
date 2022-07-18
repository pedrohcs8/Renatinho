const Command = require('@util/structures/Command')
const roleSizeSchema = require('@schemas/role-size-schema')
const { fetchChannelData } = require('@features/role-size-channel')

module.exports = class RoleSizeChannelCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'rolecounter'
    this.category = 'Moderation'
    this.description = 'Comando setar a um canal contador de cargos'
    this.usage = 'rolecounter <id de um canal de **VOZ**>'
    this.aliases = ['rolecounter', 'rolec']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }
    const { guild } = message
    const syntax = `${guild.commandPrefix}roleCounter <ID do Canal de Voz> <ID do cargo ou "all"> <Texto>`

    if (args.legth < 3) {
      message.reply(`Sintaxe correta: ${syntax}`)
      return
    }

    const channelId = args.shift()
    const channel = guild.channels.cache.get(channelId)
    if (!channel || channel.type !== 'voice') {
      message.reply(`Você deve prover o ID de um canal de voz:\n${syntax}`)
      return
    }

    const roleId = args.shift().toLowerCase()
    if (roleId !== 'all') {
      const role = guild.roles.cache.get(roleId)
      if (!role) {
        message.reply(
          `Você deve prover ou um cargo válido ou a palavra all para todos os membros do servidor:\n${syntax}`
        )
        return
      }
    }

    const text = args.join(' ')

    await roleSizeSchema.findOneAndUpdate(
      {
        guildId: guild.id,
        channelId,
      },
      {
        guildId: guild.id,
        channelId,
        roleId,
        text,
      },
      {
        upsert: true,
      }
    )

    message.reply('Canal de voz contador setado!')

    fetchChannelData()
  }
}
