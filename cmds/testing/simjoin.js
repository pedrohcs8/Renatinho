const Command = require('@structures/Command')

module.exports = class SimJoinCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'simjoin'
    this.category = 'Moderation'
    this.description = 'Comando para simular uma entrada'
    this.usage = 'simjoin'
    this.aliases = ['simjoin']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }
    this.client.emit('guildMemberAdd', message.member)
  }
}
