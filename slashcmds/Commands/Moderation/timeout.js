const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js')

const database = require('../../../schemas/infractions-schema')
const ms = require('ms')

module.exports = {
  category: 'Moderação',
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Bota um membro em timeout.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption((options) =>
      options
        .setName('alvo')
        .setDescription('Escolha o membro que levará o timeout')
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName('duração')
        .setDescription('Duração do timeout (1m,1h,1d)')
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName('razão')
        .setDescription('Razão do timeout')
        .setMaxLength(512)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, guild, member } = interaction

    const target = options.getMember('alvo')
    const duration = options.getString('duração')
    const reason = options.getString('razão') || 'Não especificado'

    const errorsArray = []

    const errorsEmbed = new EmbedBuilder()
      .setAuthor({ name: 'Não consegui colocar o membro em timeout pois:' })
      .setColor('Red')

    if (!target) {
      return interaction.reply({
        embeds: [
          errorsEmbed.setDescription(
            'O membro provavelmente saiu do servidor.'
          ),
        ],
        ephemeral: true,
      })
    }

    if (!ms(duration) || ms(duration) > ms('28d')) {
      errorsArray.push(
        'A duração especificada é inválida ou maior que o limite de 28 dias.'
      )
    }

    if (!target.manageable || !target.moderatable) {
      errorsArray.push('O membro selecionado tem um cargo maior que o bot.')
    }

    if (member.roles.highest.position < target.roles.highest.position) {
      errorsArray.push('Você tem um cargo menor que o do membro especificado')
    }

    if (errorsArray.length) {
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorsArray.join('\n'))],
        ephemeral: true,
      })
    }

    target.timeout(ms(duration), reason).catch((err) => {
      interaction.reply({
        embeds: [
          errorsEmbed.setDescription(
            'Houve um erro ao tentar o timeout no membro'
          ),
        ],
      })
      return console.log('Erro ao tentar dar timeout em alguém, erro:', err)
    })

    const newInfractionsObject = {
      IssuerId: member.id,
      IssuerTag: member.user.tag,
      Reason: reason,
      Date: Date.now(),
    }

    let userData = await database.findOne({ Guild: guild.id, User: target.id })

    if (!userData) {
      userData = await database.create({
        Guild: guild.id,
        User: target.id,
        Infractions: [newInfractionsObject],
      })
    } else {
      userData.Infractions.push(newInfractionsObject) && (await userData.save())
    }

    const sucessEmbed = new EmbedBuilder()
      .setAuthor({ name: 'Timeout', iconURL: guild.iconURL() })
      .setColor(process.env.EMBED_COLOR)
      .setDescription(
        [
          `${target} levou timeout por **${ms(ms(duration), {
            long: true,
          })}** pelo membro ${member}.`,
          `levando seu número total de infrações para: **${userData.Infractions.length} infrações**.`,
          `\nRazão: ${reason}`,
        ].join('\n')
      )

    return interaction.reply({ embeds: [sucessEmbed] })
  },
}
