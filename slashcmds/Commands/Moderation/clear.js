const { CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'clear',
  description: 'Deleta mensagens',
  permission: 'MANAGE_MESSAGES',
  options: [
    {
      name: 'quantidade',
      description: 'Selecione a quantidade de mensagens que serão deletadas',
      type: 'NUMBER',
      required: true,
    },
    {
      name: 'alvo',
      description: 'Deleta as mensagens da pessoa alvo',
      type: 'USER',
      required: false,
    },
  ],

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const { channel, options, member } = interaction

    const Amount = options.getNumber('quantidade')
    const Target = options.getMember('alvo')

    const Messages = await channel.messages.fetch()

    const Response = new MessageEmbed().setColor('#8000FF')

    if (Target) {
      console.log('Target')
      let i = 0
      const filtered = []

      ;(await Messages).filter((m) => {
        if (m.author.id === Target.id && Amount > i) {
          filtered.push(m)
          i++
        }
      })

      await channel.bulkDelete(filtered, true).then((messages) => {
        Response.setDescription(
          `🧹 Deletei ${messages.size} mensagens de ${Target}.`
        )
        interaction.reply({ embeds: [Response] })
      })
    } else {
      try {
        const size = Math.ceil(Amount / 100)

        if (size === 1) {
          let messages = await channel.messages.fetch({ limit: Amount })

          const deleted = await channel.bulkDelete(messages, true)

          Response.setDescription(`🧹 Deletei ${deleted.size} mensagens`)

          interaction.reply({ embeds: [Response] })
        } else {
          let length = 0

          for (let i = 0; i < size; i++) {
            let messages = await channel.messages.fetch({
              limit: i === size.length - 1 ? Amount - (pages - 1) * 100 : 100,
            })

            messages = messages.array().filter((x) => x.pinned === false)

            const deleted = await channel.bulkDelete(messages, true)

            length += deleted.size

            if (deleted.size < messages.length) continue
          }
        }
      } catch {
        interaction.reply(
          'Não achei tantas mensagens! Coloque um número menor, 100 é o melhor número para usar.'
        )
      }
    }
  },
}
