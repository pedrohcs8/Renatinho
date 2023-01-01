const Command = require('@util/structures/Command')
const ClientEmbed = require('../../util/structures/ClientEmbed')

module.exports = class CatCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'avatar'
    this.category = 'Misc'
    this.description = 'Comando para mandar a foto de seu avatar'
    this.usage = 'avatar'
    this.aliases = ['pfp']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const target = message.mentions.users.first() || message.author

    const embed = new ClientEmbed(author)
      .setAuthor(`Avatar de ${target.tag}`)
      .setImage(target.displayAvatarURL({ dynamic: true, size: 2048 }))

    message.reply({ embeds: [embed] })
  }
}
