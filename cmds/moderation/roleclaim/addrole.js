const Command = require('@util/structures/Command')
const { MessageActionRow, MessageSelectMenu } = require('discord.js')

module.exports = class Name extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'addrole'
    this.category = 'Moderation'
    this.description = 'Comando para mandar adicionar cargos ao seletor'
    this.usage =
      'roleclaim addrole <# do canal do seletor> <id da mensagem com o seletor> <@ do cargo>'
    this.aliases = ['add']
    this.reference = 'roleclaim'

    this.enabled = true
    this.guildOnly = true
    this.isSub = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }

    const channel = message.mentions.channels.first()
    const messageId = args[2]
    const role = message.mentions.roles.first()

    if (!role) {
      message.reply('Cargo inexistente ou desconhecido')
      return
    }

    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true,
    })

    if (!targetMessage) {
      message.reply('Id de mensagem incorreto!')
      return
    }

    let row = targetMessage.components[0]

    if (!row) {
      row = new MessageActionRow()
    }

    const option = [{ label: role.name, value: role.id }]

    let menu = row.components[0]
    if (menu) {
      if (menu.options.value === option[0].value) {
        message.reply(`<@&${o.value}> já é parte desse menu.`)
        return
      }

      menu.addOptions(option)
      menu.setMaxValues(menu.options.length)
    } else {
      row.addComponents(
        new MessageSelectMenu()
          .setCustomId('auto_roles')
          .setMinValues(0)
          .setMaxValues(1)
          .setPlaceholder('Selecione os cargos desejados')
          .addOptions(option)
      )
    }

    targetMessage.edit({
      components: [row],
    })

    message.reply(`Adicionei o cargo <@&${role.id}> no menu`)
  }
}
