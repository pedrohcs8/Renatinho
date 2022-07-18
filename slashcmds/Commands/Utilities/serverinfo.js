const { CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'serverinfo',
  description: 'Sistema para olhar as informações do server',

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const { guild } = interaction

    const embed = new MessageEmbed()
      .setColor(process.env.EMBED_COLOR)
      .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        {
          name: 'Geral',
          value: [
            `Nome: ${guild.name}`,
            `Criado: <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
            `Dono: <@${guild.ownerId}>`,
            `Descrição: ${
              !guild.description ? 'Sem Descrição' : guild.description
            }`,
          ].join('\n'),
        },
        {
          name: '💡 | Usuários',
          value: [
            `- Membros: ${guild.members.cache.filter((m) => !m.user.bot).size}`,
            `- Bots: ${guild.members.cache.filter((m) => m.user.bot).size}`,

            `\n**Total: ${guild.memberCount}**`,
          ].join('\n'),
        },
        {
          name: '📰 | Canais',
          value: [
            `- Texto: ${
              guild.channels.cache.filter((c) => c.type == 'GUILD_TEXT').size
            }`,
            `- Voz: ${
              guild.channels.cache.filter((c) => c.type == 'GUILD_VOICE').size
            }`,
            `- Tópicos: ${
              guild.channels.cache.filter(
                (c) =>
                  c.type == 'GUILD_PUBLIC_THREAD' &&
                  'GUILD_PRIVATE_THREAD' &&
                  'GUILD_NEWS_THREAD'
              ).size
            }`,
            `- Categorias: ${
              guild.channels.cache.filter((c) => c.type == 'GUILD_CATEGORY')
                .size
            }`,
            `- Palcos: ${
              guild.channels.cache.filter((c) => c.type == 'GUILD_STAGE_VOICE')
                .size
            }`,
            `- Notícias: ${
              guild.channels.cache.filter((c) => c.type == 'GUILD_NEWS').size
            }`,

            `\n**Total: ${guild.channels.cache.size}**`,
          ].join('\n'),
        },
        {
          name: '🤔 | Emojis e Figurinhas',
          value: [
            `- Animados: ${guild.emojis.cache.filter((e) => e.animated).size}`,
            `- Estático: ${guild.emojis.cache.filter((e) => !e.animated).size}`,
            `- Figurinhas: ${guild.stickers.cache.size}`,

            `\n**Total: ${
              guild.stickers.cache.size + guild.emojis.cache.size
            }**`,
          ].join('\n'),
        },
        {
          name: '📈 | Estatísticas de Nitro',
          value: [
            `- Tier: ${guild.premiumTier
              .replace('TIER_', '')
              .replace('NONE', '0')}`,
            `- Boots: ${guild.premiumSubscriptionCount}`,
            `- Boosters: ${
              guild.members.cache.filter((m) => m.premiumSince).size
            }`,

            ,
          ].join('\n'),
        }
      )
      .setFooter('A equipe do Renatinho agradece sua preferência 😁')

    interaction.reply({ embeds: [embed] })
  },
}
