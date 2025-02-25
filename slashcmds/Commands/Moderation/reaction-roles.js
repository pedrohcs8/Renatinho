const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
  EmbedBuilder,
} = require('discord.js')
const reactionRolesSchema = require('../../../schemas/reaction-roles-schema')

const config = require('@root/config.json')

module.exports = {
  category: 'Moderação',
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('reaction-roles')
    .setDescription('Comando para configurar o sistema de cargos por reação')
    .addSubcommand((options) =>
      options
        .setName('add')
        .setDescription('Adiciona uma reação e um cargo a mensagem principal')
        .addStringOption((options) =>
          options
            .setName('id-mensagem')
            .setDescription('Id da mensagem que receberá a reação')
            .setMaxLength(19)
            .setMinLength(19)
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName('emoji')
            .setDescription('O emoji que será colocado debaixo da mensagem')
            .setRequired(true)
        )
        .addRoleOption((options) =>
          options
            .setName('cargo')
            .setDescription('Cargo que ficará na mensagem')
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('remove')
        .setDescription('Remode uma reação e um cargo da mensagem principal')
        .addStringOption((options) =>
          options
            .setName('id-mensagem')
            .setDescription('Id da mensagem que removerei a reação')
            .setMaxLength(19)
            .setMinLength(19)
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName('emoji')
            .setDescription('O emoji que será removido debaixo da mensagem')
            .setRequired(true)
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, guild, channel } = interaction

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply('Você não tem permissão para usar este comando')
    }

    const sub = options.getSubcommand()
    const emoji = options.getString('emoji')
    const targetMessageId = options.getString('id-mensagem')
    const role = options.getRole('cargo')

    const targetMessage = await channel.messages
      .fetch(targetMessageId)
      .catch((err) => {
        return interaction.reply(`A mensagem escolhida não está no canal`)
      })

    const numbers = emoji.match(/\d/g).join('')

    if (!/\p{Extended_Pictographic}/u.test(emoji)) {
      if (!numbers.length == 18) {
        return interaction.reply('O emoji provido não é um emoji')
      }
    }

    let parsedEmoji

    if (numbers.length == 18) {
      parsedEmoji = emoji.replace(/[^a-z]/gi, '')
    } else {
      parsedEmoji = emoji
    }

    const guildData = await reactionRolesSchema.findOne({
      guildId: guild.id,
      message: targetMessageId,
      emoji: parsedEmoji,
    })

    switch (sub) {
      case 'add': {
        if (guildData) {
          return interaction.reply(
            `Parece que você já configurou este emoji nesta mensagem!`
          )
        } else {
          await reactionRolesSchema.create({
            guildId: guild.id,
            message: targetMessage.id,
            emoji: parsedEmoji,
            role: role.id,
          })

          const embed = new EmbedBuilder()
            .setColor(process.env.EMBED_COLOR)
            .setDescription(
              `Adicionei um cargo por reação na mensagem ${targetMessage.url} com o emoji ${emoji} e o cargo ${role} com sucesso`
            )

          await targetMessage.react(emoji).catch((err) => {})

          interaction.reply({ embeds: [embed] })
        }
        break
      }

      case 'remove': {
        if (!guildData) {
          return interaction.reply('Este cargo nesta mensagem não existe')
        } else {
          reactionRolesSchema.deleteOne({
            guildId: guild.id,
            message: targetMessage.id,
            emoji: parsedEmoji,
          })

          targetMessage.reactions.cache
            .find((x) => x.emoji.name == parsedEmoji)
            .users.remove(config.botid)

          const embed = new EmbedBuilder()
            .setColor(process.env.EMBED_COLOR)
            .setDescription(
              `Removi um cargo por reação na mensagem ${targetMessage.url} com o emoji ${emoji} e o cargo ${role} com sucesso`
            )

          interaction.reply({ embeds: [embed] })
        }
      }
    }
  },
}
