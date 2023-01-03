const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emit')
    .setDescription('Emite o evento guildMemberAdd/Remove')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  execute(interaction, client) {
    client.emit('guildMemberAdd', interaction.member)

    interaction.reply({
      content: 'Emiti o evento guildMemberAdd.',
      ephemeral: true,
    })
  },
}
