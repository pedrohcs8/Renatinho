const { EmbedBuilder } = require('@discordjs/builders')
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require('discord.js')

const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
  subsincluded: true,
  category: 'Moderação',
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Configura o sistema de mensagens de boas vindas')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand((options) =>
      options
        .setName('info')
        .setDescription('Mostra as informações do sistema de boas vindas')
    )
    .addSubcommand((options) =>
      options
        .setName('set')
        .setDescription('configura o sistema de boas vindas')
        .addChannelOption((options) =>
          options
            .setName('canal')
            .setDescription('Canal que será mandado a mensagem')
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName('mensagem')
            .setDescription('Mensagem que será mandada quando o membro entrar')
            .setRequired(true)
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, guild } = interaction

    const channel = options.getChannel('canal')
    const message = options.getString('mensagem')

    const guildData = await guildSchema.findOne({ idS: guild.id })

    switch (options.getSubcommand()) {
      case 'info': {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} - Sistema de Boas Vindas`,
            iconURL: guild.iconURL(),
          })
          .setColor(0x8000ff)
          .addFields(
            {
              name: 'Canal configurado',
              value:
                guildData.welcome.channel == 'null'
                  ? 'Nenhum canal'
                  : `<#${guildData.welcome.channel}>`,
            },
            {
              name: 'Mensagem configurada',
              value:
                guildData.welcome.msg == 'null'
                  ? 'Nenhuma mensagem'
                  : `<#${guildData.welcome.msg}>`,
            },
            {
              name: 'Status do Sistema',
              value: `Atualmente o sistema está: **${
                guildData.welcome.status ? 'ativado' : 'desativado'
              }**`,
            }
          )

        interaction.reply({ embeds: [embed] })

        break
      }

      case 'set': {
        await guildSchema.findOneAndUpdate(
          { idS: guild.id },
          {
            $set: {
              'welcome.channel': channel.id,
              'welcome.msg': message,
              'welcome.status': true,
            },
          },
          { upsert: true }
        )

        interaction.reply('Sistema de boas vindas configurado com sucesso.')
      }
    }
  },
}
