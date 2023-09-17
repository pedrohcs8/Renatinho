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
    .setName('ban')
    .setDescription('Comando para banir membros')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((options) =>
      options
        .setName('membro')
        .setDescription('O membro que será banido')
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName('motivo')
        .setDescription('Motivo do banimento')
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

    const embed = new EmbedBuilder()
      .setColor(process.env.EMBED_COLOR)
      .setAuthor({ name: 'Sistema de Bans', iconURL: guild.iconURL() })

    if (target.id === member.id) {
      interaction.reply('❌ - Você não pode banir você mesmo!')
      return
    }

    if (target.roles.highest.position > member.roles.highest.position) {
      interaction.reply(
        '❌ - Você não pode banir uma pessoa com o cargo maior que o seu!'
      )
      return
    }

    target
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(process.env.EMBED_COLOR)
            .setAuthor({ name: 'Sistema de Bans', iconURL: guild.iconURL() })
            .setDescription(`Você foi banido por ${reason}.`),
        ],
      })
      .catch(() => {
        console.log(
          `Não consegui mandar a mensagem de ban para o usuário ${target.user.tag}`
        )
      })

    embed.setDescription(`O usuário ${target} foi banido por \`${reason}\``)
    interaction.reply({ embeds: [embed] })

    infractionsSchema.findOne(
      { guildId: guild.id, userId: target.id },
      async (err, data) => {
        if (err) throw err

        if (!data || !data.banData) {
          data = new infractionsSchema({
            guildId: guild.id,
            userId: target.id,
            banData: [
              {
                executerId: member.id,
                executerTag: member.user.tag,
                targetId: target.id,
                targetTag: target.tag,
                messages: amount,
                reason: reason,
                date: parseInt(interaction.createdTimestamp / 1000),
              },
            ],
          })
        } else {
          const BanDataObject = {
            executerId: member.id,
            executerTag: member.user.tag,
            targetId: target.id,
            targetTag: target.tag,
            messages: amount,
            reason: reason,
            date: parseInt(interaction.createdTimestamp / 1000),
          }
          data.banData.push(BanDataObject)
        }
        data.save()
      }
    )

    target.ban({ days: amount, reason: reason }).catch((err) => {
      console.log(err)
    })
  },
}
