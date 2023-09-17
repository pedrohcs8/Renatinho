const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js')
const infractionsSchema = require('../../../schemas/infractions-schema')

module.exports = {
  category: 'Moderação',
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Comando para kickar membros')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((options) =>
      options
        .setName('membro')
        .setDescription('O membro que será expulso')
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName('motivo')
        .setDescription('Motivo do kick')
        .setRequired(true)
    ),

  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(client, interaction) {
    const { guild, member, options } = interaction

    const target = guild.members.cache.get(options.getUser('membro').id)
    const reason = options.getString('motivo')
    const amount = 0

    const targetMember = guild.members.cache.get(target.id)
    targetMember.kick({ reason: !reason ? '' : reason })
    interaction.reply(`O usuário ${target} foi kickado`)

    infractionsSchema.findOne(
      { guildId: guild.id, userId: target.id },
      async (err, data) => {
        if (err) throw err

        if (!data || !data.banData) {
          data = new infractionsSchema({
            guildId: guild.id,
            userId: target.id,
            kickData: [
              {
                executerId: member.id,
                executerTag: member.user.tag,
                targetId: target.id,
                targetTag: target.tag,
                reason: reason,
                date: parseInt(interaction.createdTimestamp / 1000),
              },
            ],
          })
        } else {
          const KickDataObject = {
            executerId: member.id,
            executerTag: member.user.tag,
            targetId: target.id,
            targetTag: target.tag,
            reason: reason,
            date: parseInt(interaction.createdTimestamp / 1000),
          }
          data.kickData.push(KickDataObject)
        }
        data.save()
      }
    )
  },
}
