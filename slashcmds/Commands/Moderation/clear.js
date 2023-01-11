const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require('discord.js')
const discord_html_transcript = require('discord-html-transcripts')

const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deleta as mensagens do chat')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addNumberOption((options) =>
      options
        .setName('quantidade')
        .setDescription('Quantidade de mensagens que serão deletadas')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName('motivo')
        .setDescription('Motivo das mensagens serem deletadas')
        .setRequired(true)
    )
    .addUserOption((options) =>
      options
        .setName('membro')
        .setDescription(
          'Selecione o membro que você deseja deletar somente as mensagens dele'
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, guild } = interaction

    const doc = await guildSchema.findOne({ idS: guild.id })

    const amount = options.getNumber('quantidade')
    const reason = options.getString('motivo')
    const target = options.getUser('membro')

    const messages = await interaction.channel.messages.fetch()
    const logChannel = interaction.guild.channels.cache.get(doc.logs.channel)

    console.log(doc.logs.channel)

    const responseEmbed = new EmbedBuilder().setColor(process.env.EMBED_COLOR)
    const logEmbed = new EmbedBuilder()
      .setColor(process.env.EMBED_COLOR)
      .setAuthor({ name: `Sistema de Clear` })

    let logEmbedDescription = [
      `• Moderador: ${interaction.member}`,
      `• Membro Alvo: ${target || 'Nenhum/Geral'}`,
      `• Canal ${interaction.channel}`,
      `• Motivo: ${reason}`,
    ]

    if (target) {
      let i = 0
      let messagesToDelete = []

      messages.filter((message) => {
        if (message.author.id == target.id && amount > i) {
          messagesToDelete.push(message)
          i++
        }
      })

      const transcript = await discord_html_transcript.generateFromMessages(
        messagesToDelete,
        interaction.channel
      )

      await interaction.deferReply()

      await interaction.channel
        .bulkDelete(messagesToDelete, true)
        .then(async (messages) => {
          await interaction.editReply({
            embeds: [
              responseEmbed.setDescription(
                `🧹 Deletei \`${messages.size}\` mensagens de ${target}!`
              ),
            ],
          })

          logEmbedDescription.push(`• Deletei: ${messages.size} mensagem(ns)`)

          if (logChannel && doc.logs.status) {
            logChannel.send({
              embeds: [logEmbed.setDescription(logEmbedDescription.join('\n'))],
              files: [transcript],
            })
          } else {
            interaction.channel.send({
              content: `Eu não consegui mandar uma mensagem de log pois não há nenhum canal de logs configurado, configure com /logs.`,
              ephemeral: true,
            })
          }
        })
    } else {
      await interaction.deferReply()

      const transcript = await discord_html_transcript.createTranscript(
        interaction.channel,
        { limit: amount }
      )

      await interaction.channel
        .bulkDelete(amount, true)
        .then(async (messages) => {
          await interaction.editReply({
            embeds: [
              responseEmbed.setDescription(
                `🧹 Deletei \`${messages.size}\` mensagens!`
              ),
            ],
          })

          logEmbedDescription.push(`• Deletei: ${messages.size} mensagem(ns)`)

          if (logChannel && doc.logs.status) {
            logChannel.send({
              embeds: [logEmbed.setDescription(logEmbedDescription.join('\n'))],
              files: [transcript],
            })
          } else {
            interaction.channel.send({
              content: `Eu não consegui mandar uma mensagem de log pois não há nenhum canal de logs configurado, configure com /logs.`,
              ephemeral: true,
            })
          }
        })
    }
  },
}
