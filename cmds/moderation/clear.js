const Command = require('@util/structures/Command')
const { MessageEmbed } = require('discord.js')

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'clear'
    this.category = 'Moderation'
    this.description = 'Comando para limpar o chat'
    this.usage = 'clear <quantidade>'
    this.aliases = ['limpar', 'cc']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }, t) {
    if (!message.member.permissions.has('MANAGE_MESSAGES'))
      return message.reply(
        `${message.author}, você precisa da permissão **MANAGE_MESSAGES* para executar este comando.`,
      )

    if (!args[0])
      return message.reply(
        `${message.author}, você deve inserir quantas mensagens deseja apagar no chat.`,
      )

    const amount = parseInt(args[0])

    if (amount > 1000 || amount < 2)
      return message.reply(
        `${message.author}, você deve inserir um número de **2** à **1000** para eu limpar em mensagens.`,
      )

    const size = Math.ceil(amount / 100)

    if (size === 1) {
      let messages = await message.channel.messages.fetch({ limit: amount })

      const deleted = await message.channel.bulkDelete(messages, true)

      message.channel.send(
        `${message.author}, deletei **${deleted.size}** mensagens`,
      )
    } else {
      let length = 0

      for (let i = 0; i < size; i++) {
        let messages = await message.channel.messages.fetch({
          limit: i === size.length - 1 ? amount - (pages - 1) * 100 : 100,
        })

        messages = messages.array().filter((x) => x.pinned === false)

        const deleted = await message.channel.bulkDelete(messages, true)

        length += deleted.size

        if (deleted.size < messages.length) continue
      }
    }
  }
}
