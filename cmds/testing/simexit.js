const Command = require('@structures/Command')

module.exports = class SimExitCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'simexit'
    this.category = 'Moderation'
    this.description = 'Comando para simular a saída de alguém'
    this.usage = 'simexit'
    this.aliases = ['simexit', 'simleave']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }
    this.client.emit('guildMemberRemove', message.member)
  }
}
