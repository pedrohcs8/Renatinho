const { Message, EmbedBuilder } = require('discord.js')
const db = require('../../../schemas/afk-schema')

module.exports = {
  name: 'messageCreate',

  /**
   *
   * @param {Message} message
   */

  async execute(message) {
    if (message.author.bot) {
      return
    }

    if (message.mentions.members.size) {
      const embed = new EmbedBuilder().setColor('DARK_PURPLE')
      message.mentions.members.forEach((m) => {
        db.findOne(
          { guildId: message.guild.id, userId: m.id },
          async (err, data) => {
            if (err) {
              throw err
            }

            if (data) {
              embed.setDescription(
                `${m} ficou AFK há <t:${data.time}:R>\n **Status**: ${data.status}`
              )
              return message.reply({ embeds: [embed] })
            }
          }
        )
      })
    }
  },
}
