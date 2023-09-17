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
    .setName('autorole')
    .setDescription('Configura o sistema de mensagens de boas vindas')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand((options) =>
      options
        .setName('info')
        .setDescription('Mostra as informações do sistema de autorole')
    )
    .addSubcommand((options) =>
      options
        .setName('add')
        .setDescription('Adiciona um cargo no sistema de autorole')
        .addRoleOption((options) =>
          options
            .setName('cargo')
            .setDescription('Cargo que será colocado')
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('remove')
        .setDescription('Remove um cargo no sistema de autorole')
        .addRoleOption((options) =>
          options
            .setName('cargo')
            .setDescription('Cargo que será retirado')
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('liga-desliga')
        .setDescription('Remove um cargo no sistema de autorole')
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
   */

  async execute(interaction) {
    const { options, guild } = interaction

    const role = options.getRole('cargo')

    const guildData = await guildSchema.findOne({ idS: guild.id })

    switch (options.getSubcommand()) {
      case 'info': {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} - Sistema de Autorole`,
            iconURL: guild.iconURL(),
          })
          .setColor(0x8000ff)
          .addFields(
            {
              name: 'Cargos',
              value: !guildData.autorole.roles.length
                ? 'Nenhum cargo'
                : `${guildData.autorole.roles
                    .map((x) => `<@&${x}>`)
                    .join(', ')} | **[${guildData.autorole.roles.length}]**`,
            },
            {
              name: 'Status do Sistema',
              value: `Atualmente o sistema está: **${
                guildData.autorole.status ? 'ativado' : 'desativado'
              }**`,
            },
            {
              name: 'Help',
              value: `> **\`autorole add <cargo>\`** - Adiciona um cargo\n> **\`autorole remove <cargo>\`** - Remove um cargo\n> **\`autorole list\`** - Lista os cargos setados\n> **\`autorole <on/off>\`** - Ativa ou desativa o sistema`,
            }
          )

        interaction.reply({ embeds: [embed] })

        break
      }

      case 'add': {
        if (guildData.autorole.roles.lenght > 5) {
          return interaction.reply('O limite de cargos foi atingido')
        } else if (guildData.autorole.roles.find((x) => x == role.id)) {
          return interaction.reply('Este cargo já está no sistema de autorole')
        }

        interaction.reply('Cargo adicionado ao sistema com sucesso.')
        await guildSchema.findOneAndUpdate(
          { idS: guild.id },
          { $push: { 'autorole.roles': role.id } }
        )
        break
      }

      case 'remove': {
        if (!guildData.autorole.roles.length) {
          return interaction.reply(
            'Não tem nenhum cargo no sistema de autorole'
          )
        } else if (!guildData.autorole.roles.find((x) => x == role.id)) {
          return interaction.reply('Este cargo não está no sistema de autorole')
        }

        interaction.reply('Cargo removido ao sistema com sucesso.')
        await guildSchema.findOneAndUpdate(
          { idS: guild.id },
          { $pull: { 'autorole.roles': role.id } }
        )
        break
      }

      case 'liga-desliga': {
        const selectedoption = options.getString('opções')

        switch (selectedoption) {
          case 'liga': {
            interaction.reply('O sistema de Autorole foi ligado.')
            await guildSchema.findOneAndUpdate(
              { idS: guild.id },
              { $set: { 'autorole.status': true } }
            )
            break
          }

          case 'desliga': {
            interaction.reply('O sistema de Autorole foi desligado.')
            await guildSchema.findOneAndUpdate(
              { idS: guild.id },
              { $set: { 'autorole.status': false } }
            )
            break
          }
        }
      }
    }
  },
}
