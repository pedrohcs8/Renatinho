const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  AttachmentBuilder,
} = require('discord.js')
const Emojis = require('../../../util/Emojis')

const { profileImage } = require('discord-arts')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('memberinfo')
    .setDescription('Olhe as suas informações do seu perfil')
    .setDMPermission(false)
    .addUserOption((options) =>
      options
        .setName('membro')
        .setDescription(
          'Mostra as informações do membro. Deixe vazio para ver a sua'
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, guild } = interaction

    await interaction.deferReply()
    const member = options.getMember('membro') || interaction.member

    if (member.user.bot) {
      const errorEmbed = new EmbedBuilder().setDescription(
        'Bots não são suportados neste comando'
      )

      return interaction.editReply({
        embeds: [errorEmbed],
        ephemeral: true,
      })
    }

    try {
      const fetchedMembers = await guild.members.fetch()

      const profileBuffer = await profileImage(member.id)
      const imageAttachment = new AttachmentBuilder(profileBuffer, {
        name: 'profile.png',
      })

      const joinPosition =
        Array.from(
          fetchedMembers
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            .keys()
        ).indexOf(member.id) + 1

      const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role)
        .slice(0, 3)

      let userBadges = member.user.flags.toArray()
      userBadges = userBadges.slice(userBadges.length / 2)

      console.log(userBadges)

      const joinTime = parseInt(member.joinedTimestamp / 1000)
      const createdTime = parseInt(member.user.createdTimestamp / 1000)

      const Booster = member.premiumSince ? Emojis.Booster : '❌'

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${member.user.tag} | Informações Gerais`,
          iconURL: member.displayAvatarURL(),
        })
        .setColor(process.env.EMBED_COLOR)
        .setDescription(
          `Em <t:${joinTime}:D>, ${member.user.username} foi o **${addSuffix(
            joinPosition
          )}** a entrar no servidor`
        )
        .setImage('attachment://profile.png')
        .addFields([
          {
            name: 'Badges',
            value: `${addBadges(userBadges).join('')}`,
            inline: true,
          },
          {
            name: 'Nitro',
            value: `${Booster}`,
            inline: true,
          },
          {
            name: 'Cargos Mais Importantes',
            value: `${topRoles
              .join(', ')
              .replace(`<@${interaction.guildId}>`)}`,
            inline: false,
          },
          {
            name: 'Entrou no Servidor',
            value: `<t:${joinTime}:R>`,
            inline: true,
          },
          {
            name: 'Id do Membro',
            value: `${member.id}`,
            inline: true,
          },
          {
            name: 'Avatar',
            value: `[Link](${member.displayAvatarURL()})`,
            inline: true,
          },
          {
            name: 'Banner',
            value: `[Link](${(await member.user.fetch()).bannerURL()})`,
            inline: true,
          },
        ])

      interaction.editReply({ embeds: [embed], files: [imageAttachment] })
    } catch (error) {
      console.log(error)
    }
  },
}

function addSuffix(number) {
  return number + '°'
}

function addBadges(badgeNames) {
  if (!badgeNames.length) return ['X']
  const badgeMap = {
    ActiveDeveloper: Emojis.ActiveDeveloper,
    BugHunterLevel1: Emojis.BugHunterLevel1,
    BugHunterLevel2: Emojis.BugHunterLevel2,
    PremiumEarlySupporter: Emojis.EarlySupporter,
    Partner: Emojis.Partner,
    Staff: Emojis.Staff,
    HypeSquadOnlineHouse1: Emojis.Bravery, // bravery
    HypeSquadOnlineHouse2: Emojis.Brilliance, // brilliance
    HypeSquadOnlineHouse3: Emojis.Balance, // balance
    Hypesquad: Emojis.HypesquadIcon,
    CertifiedModerator: Emojis.CertifiedModerator,
    VerifiedDeveloper: Emojis.Verified_Developer,
  }

  return badgeNames.map((badgeName) => badgeMap[badgeName] || '❔')
}
