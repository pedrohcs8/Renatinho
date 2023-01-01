const Command = require('@util/structures/Command')
const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = class Buttons extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'buttons'
    this.category = 'Dono'
    this.description = 'Comando para testar os novos botões'
    this.usage = 'buttons'
    this.aliases = ['test']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    if (message.author.id !== '227559154007408641') {
      return message.reply('Só o pedro pode usar esse comando!')
    }

    const row = new MessageActionRow()
    const firstButton = new MessageButton()
      .setCustomId('first')
      .setLabel('Aperta pedrin')
      .setStyle('PRIMARY')
      .setDisabled(false)

    row.addComponents([firstButton])

    const msg = await message.reply({ content: 'testing', components: [row] })

    let collect

    const filter = (interaction) => {
      return interaction.isButton() && interaction.message.id === msg.id
    }

    const collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 60000,
    })

    collector.on('collect', async (x) => {
      if (x.user.id != message.author.id) return x.update({ ephemeral: true })

      collect = x

      switch (x.customId) {
        case 'first': {
          msg.edit({ content: 'teste', components: [] })
        }
      }
    })

    collector.on('end', (x) => {
      if (collect) return
      //   x.update({ components: [] })
    })
  }
}
