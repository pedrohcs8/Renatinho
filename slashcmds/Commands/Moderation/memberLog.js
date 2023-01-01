const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  Client,
} = require('discord.js')
const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('memberlog')
    .setDescription('Configure os sistemas do bot no seu servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addChannelOption((options) =>
      options
        .setName('canal')
        .setDescription('O canal onde os logs serão mandados')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { guild, options } = interaction

    const log_channel = options.getChannel('canal')

    await guildSchema.findOneAndUpdate(
      { idS: guild.id },
      { $set: { 'autorole.logChannel': log_channel.id } },
      {
        new: true,
        upsert: true,
      }
    )

    client.guildConfig.set(guild.id, {
      logChannel: log_channel,
    })

    const embed = new EmbedBuilder()
      .setColor(0x8000ff)
      .setDescription(
        [
          `- Canal de Log de membros atualizado para: <#${log_channel.id}> -`,
        ].join('\n')
      )

    return interaction.reply({ embeds: [embed] })
  },
}
