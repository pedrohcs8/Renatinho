const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
} = require('discord.js')

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Recarrega os comandos/eventos')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) =>
      options.setName('eventos').setDescription('Recarregue seus eventos.')
    )
    .addSubcommand((options) =>
      options.setName('comandos').setDescription('Recarregue seus comandos')
    ),
}
