const { Guild, EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'guildCreate',

  /**
   *
   * @param {Guild} guild
   */

  async execute(guild) {
    try {
      const JOIN = new EmbedBuilder()
        .setTimestamp()
        .setColor(process.env.EMBED_COLOR)
        .setThumbnail(guild.iconURL({ dynamic: true, size: 2048 }))

      const INVITE = await guild.invites
        .fetch()
        .then((invites) => {
          if (invites) return invites.random().url
          return false
        })
        .catch(() => {
          return false
        })

      if (INVITE) JOIN.setURL(INVITE).setTitle(guild.name)

      const owner = await guild.fetchOwner()

      JOIN.setAuthor(
        `${guild.client.user.username} | Adicionado à um Servidor`
      ).addFields(
        {
          name: `Nome do Servidor`,
          value: `${guild.name}`,
          inline: true,
        },
        {
          name: `ID Do Servidor`,
          value: `${guild.id}`,
          inline: true,
        },
        {
          name: `Propietário`,
          value: `${owner}`,
          inline: true,
        },
        {
          name: `ID Do Propietário`,
          value: `${owner.id}`,
          inline: true,
        },
        {
          name: `Total de Usuários`,
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: `Total de Canais`,
          value: `${guild.channels.cache.size}`,
          inline: true,
        }
      )

      this.client.channels.cache
        .get(process.env.CHANNEL_LOGS)
        .send({ embeds: [JOIN] })
    } catch (err) {
      console.log(`EVENTO: GuildCreate ${err}`)
    }
  },
}
