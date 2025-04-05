const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js')

module.exports = {
  category: 'Informação',
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Olhe as suas informações do servidor')
    .setDMPermission(false),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { guild } = interaction

    const { name, memberCount, afkTimeout, ownerId } = guild
    const icon = guild.iconURL()

    const tag = guild.members.cache.get(ownerId).user.tag

    const embed = new EmbedBuilder()
      .setTitle(`${name}`)
      .setThumbnail(icon)
      .setColor('#0040FF')
      .addFields(
        {
          name: '💻ID',
          value: guild.id,
          inline: true,
        },
        {
          name: '👥Membros',
          value: memberCount.toString(),
          inline: true,
        },
        {
          name: '👑Dono(a)',
          value: tag,
          inline: true,
        },
        {
          name: '📆Criado',
          value: `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: '📴AFK Timeout',
          value: (afkTimeout / 60).toString(),
          inline: true,
        }
      )

    interaction.reply({ embeds: [embed] })
  },
}
