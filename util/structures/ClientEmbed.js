const Discord = require('discord.js')

module.exports = class ClientEmbed extends Discord.MessageEmbed {
  constructor(user, data = {}) {
    super(data)
    this.setTimestamp()
    this.setFooter(
      `Pedido por ${user.tag}`,
      user.displayAvatarURL({ dynamic: true }),
    )
  }
}
