const Discord = require('discord.js')

module.exports = class ClientEmbed extends Discord.EmbedBuilder {
  constructor(user, data = {}) {
    super(data)
    this.setTimestamp()
    this.setFooter(
      `Pedido por ${user.tag}`,
      user.displayAvatarURL({ dynamic: true })
    )
  }
}
