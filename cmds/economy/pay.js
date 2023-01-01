//Sistema de pagamento

const Command = require('@util/structures/Command')
const economy = require('@features/economy')
const profileSchema = require('@schemas/profile-schema')
const Util = require('@util/Utils')
const { MessageButton, MessageActionRow } = require('discord.js')
const Emojis = require('@util/Emojis')

module.exports = class PayCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'pay'
    this.category = 'Economy'
    this.description = 'Comando para pagar em renatocoins alguém'
    this.usage = 'pay <@ da pessoa> <quantia>'
    this.aliases = ['pay', 'pagar', 'transferir']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const user =
      this.client.users.cache.get(args[0]) || message.mentions.members.first()

    const doc = await this.client.database.users.findOne({
      userId: message.author.id,
    })

    const { guild, member } = message

    if (!user)
      return message.reply(
        `${message.author}, você deve mencionar para quem deseja enviar dinheiro.`
      )

    if (!args[1])
      return message.reply(
        `${message.author}, você deve inserir quanto deseja enviar.`
      )

    const money = await Util.notAbbrev(args[1])

    if (String(money) === 'NaN')
      return message.reply(`${message.author}, dinheiro inválido.`)

    if (money <= 0)
      return message.reply(`${message.author}, dinheiro menor ou igual a 0`)

    if (user.id === message.author.id)
      return message.reply(
        `${message.author}, você não pode enviar dinheiro para si mesmo.`
      )

    const coinsOwned = doc.bank

    if (money > coinsOwned)
      return message.reply(`${message.author}, você não tem esse dinheiro!`)

    const target = await this.client.database.users.findOne({ userId: user.id })

    const row = new MessageActionRow()

    const yesButton = new MessageButton()
      .setCustomId('yes')
      .setLabel('Enviar')
      .setStyle('SUCCESS')
      .setDisabled(false)

    const noButton = new MessageButton()
      .setCustomId('no')
      .setLabel('Cancela')
      .setStyle('DANGER')
      .setDisabled(false)

    row.addComponents([yesButton, noButton])

    const msg = await message.reply({
      content: `${message.author}, você deseja enviar **RC${Util.toAbbrev(
        money
      )}** para o(a) ${user}?!`,
      components: [row],
    })

    let collect

    const filter = (interaction) => {
      return interaction.isButton() && interaction.message.id === msg.id
    }

    const collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 60000,
    })

    collector.on('collect', async (x) => {
      if (x.user.id == message.author.id) {
        collect = x

        switch (x.customId) {
          case 'yes': {
            message.reply(
              `${message.author}, renatocoins enviadas com sucesso.`
            )

            await economy.addBank(guild.id, message.author.id, money * -1)

            await economy.addBank(guild.id, user.id, money)

            msg.delete()
            break
          }
          case 'no': {
            msg.delete()

            return message.reply(
              `${message.author}, envio de dinheiro cancelado.`
            )
          }
        }
      }
    })

    collector.on('end', (x) => {
      if (collect) return
      //   x.update({ components: [] })
    })
  }
}
