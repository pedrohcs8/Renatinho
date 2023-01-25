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
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Configure o sistema de logs no seu servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((options) =>
      options
        .setName('info')
        .setDescription('Mostra as informações do sistema de logs')
    )
    .addSubcommand((options) =>
      options
        .setName('canal')
        .setDescription('Canal onde os logs serão mandados')
        .addChannelOption((options) =>
          options
            .setName('canal')
            .setDescription('O canal onde os logs serão mandados')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('liga-desliga')
        .setDescription('Liga ou desliga o sistema de logs')
        .addStringOption((options) =>
          options
            .setName('opções')
            .setDescription('Escolha uma das opções')
            .addChoices(
              { name: 'liga', value: 'liga' },
              {
                name: 'desliga',
                value: 'desliga',
              }
            )
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { guild, options } = interaction

    const log_channel = options.getChannel('canal')

    const guildData = await guildSchema.findOne({ idS: guild.id })

    switch (options.getSubcommand()) {
      case 'info': {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} - Sistema de Logs`,
            iconURL: guild.iconURL(),
          })
          .setColor(0x8000ff)
          .addFields(
            {
              name: 'Canal',
              value: !guildData.logs.channel.length
                ? 'Nenhum canal'
                : `<#${guildData.logs.channel}>`,
            },
            {
              name: 'Status do Sistema',
              value: `Atualmente o sistema está: **${
                guildData.logs.status ? 'ativado' : 'desativado'
              }**`,
            }
          )

        interaction.reply({ embeds: [embed] })

        break
      }

      case 'canal': {
        await guildSchema.findOneAndUpdate(
          { idS: guild.id },
          { $set: { 'logs.channel': log_channel.id } },
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
      }

      case 'liga-desliga': {
        const selectedoption = options.getString('opções')

        switch (selectedoption) {
          case 'liga': {
            interaction.reply('O sistema de logs foi ligado.')
            await guildSchema.findOneAndUpdate(
              { idS: guild.id },
              { $set: { 'logs.status': true } }
            )
            break
          }

          case 'desliga': {
            interaction.reply('O sistema de logs foi desligado.')
            await guildSchema.findOneAndUpdate(
              { idS: guild.id },
              { $set: { 'logs.status': false } }
            )
            break
          }
        }
      }
    }
  },
}
