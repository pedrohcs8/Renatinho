const ClientEmbed = require('../../util/structures/ClientEmbed')
const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')

module.exports = class ShipCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'ship'
    this.category = 'Fun'
    this.description = 'Comando para shippar duas pessoas'
    this.usage = 'ship <@ da pessoa>'
    this.aliases = ['shippar']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const user1 = this.getUserFromMention(args[0])
    const user2 = this.getUserFromMention(args[1])

    if (!user1.id || !user2.id) {
      message.reply('Você não mencionou ninguém para shipar.')
      return
    }

    if (user1.bot == true || user2.bot == true) {
      message.reply('Infelizmente não consigo shipar bots :(')
      return
    }

    const results = await profileSchema.findOne({ userId: user2.id })

    let RN

    if (!results.ship.users.indexOf(user1.id)) {
      RN = Math.floor(Math.random() * 100) + 1
      await profileSchema.findOneAndUpdate(
        { userId: user1.id },
        { $push: { 'ship.users': `${user2.id}`, 'ship.percentage': `${RN}` } },
      )
      await profileSchema.findOneAndUpdate(
        { userId: user2.id },
        { $push: { 'ship.users': `${user1.id}`, 'ship.percentage': `${RN}` } },
      )
    } else {
      const index = results.ship.users.indexOf(user1.id)
      RN = results.ship.percentage[index]
      console.log(RN)
    }

    const unLoveEmbed = new ClientEmbed(author)
      .setTitle(
        `Não estão muito á fim, ${user1.tag} deixou ele(a) na friendzone...`,
      )
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/788515118425571378/875596417312378940/depositphotos_117511900-stock-illustration-cartoon-broken-heart-isolated-on.png',
      )
      .setDescription(`${user1} shipou com ${user2} | ${RN}`)

    const LoveEmbed = new ClientEmbed(author)
      .setTitle('O amor está no ar! Um novo casal????💘')
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/788515118425571378/875601375541755974/9k.png',
      )
      .setDescription(`${user1} shipou com ${user2} | ${RN}`)

    if (RN > 50) {
      message.reply({ embeds: [LoveEmbed] })
      return
    } else {
      message.reply({ embeds: [unLoveEmbed] })
      return
    }
  }

  getUserFromMention(mention) {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/)

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return

    // However, the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1]

    return this.client.users.cache.get(id)
  }
}
