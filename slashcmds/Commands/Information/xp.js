const canvacord = require('canvacord')
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp')
    .setDescription('Comando para ver o seu nível de xp'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { member } = interaction

    const doc = await profileSchema.findOne({ userId: member.id })

    await require('mongoose')
      .connection.collection('profiles')
      .find({ 'Exp.xp': { $gt: 5 } })
      .toArray((err, res) => {
        if (err) throw err
        let Exp = res.map((x) => x.Exp).sort((x, f) => f.level - x.level)

        let ranking =
          [...Exp.values()].findIndex((x) => x.id === interaction.user.id) + 1

        let xp = doc.Exp.xp
        let level = doc.Exp.level
        let nextLevel = doc.Exp.nextLevel * level

        const rank = new canvacord.Rank()
          .setAvatar(interaction.user.displayAvatarURL({ extension: 'jpg' }))
          .setCurrentXP(xp)
          .setRequiredXP(nextLevel)
          .setRank(ranking, 'Rank', true)
          .setLevel(level)
          .setProgressBar(`#${process.env.EMBED_COLOR}`, 'COLOR')
          .setUsername(interaction.user.username)
          .setDiscriminator(interaction.user.discriminator)

        rank.build().then((data) => {
          const attachment = new AttachmentBuilder(
            data,
            `${interaction.user.tag}-XP.png`
          )
          interaction.reply({ files: [attachment] })
        })
      })
  },
}
