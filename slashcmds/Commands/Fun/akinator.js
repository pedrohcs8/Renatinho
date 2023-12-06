const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js')
const Emojis = require('../../../util/Emojis')
const { Aki, regions } = require('aki-api')
const akinator = new Set()

module.exports = {
  category: 'Diversão',
  data: new SlashCommandBuilder()
    .setName('akinator')
    .setDescription('Cria um jogo de akinator!'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    await interaction.deferReply()

    const emojis = [
      Emojis.Certo,
      Emojis.Errado,
      Emojis.Help,
      Emojis.Thinking,
      Emojis.Angry,
      Emojis.Aki_Cancel,
    ]

    if (akinator.has(interaction.member.id)) {
      interaction.editReply('Você já tem uma partida em andamento')
      return
    }
    akinator.add(interaction.member.id)

    interaction.editReply('Estou começando sua partida!').then(async (x) => {
      //Iniciar o genio
      const region = 'pt'
      const childMode = false
      const proxy = undefined

      const aki = new Aki({ region, childMode, proxy })
      await aki.start()
      //Iniciar o genio

      const embed = new EmbedBuilder()
        .setTitle(`${aki.currentStep + 1}ª Pergunta`)
        .setThumbnail('https://i.imgur.com/6MPgU4x.png')
        .addFields({
          name: aki.question,
          value: aki.answers.map((x, f) => `${emojis[f]} | ${x}`).join('\n'),
        })

      interaction.editReply({ embeds: [embed] }).then(async (msg) => {
        for (const emoji of emojis) await msg.react(emoji)

        const collector = msg.createReactionCollector(
          (reaction, user) =>
            emojis.includes(reaction.emoji.name) &&
            user.id === interaction.member.id,
          {
            time: 60000 * 10,
          }
        )

        collector
          .on('end', () => akinator.delete(interaction.member.id))
          .on('collect', async ({ emoji, users }) => {
            users.remove(interaction.member).catch(() => null)

            if (emoji.name === Emojis.Aki_Cancel) return collector.stop()

            await aki.step(emojis.indexOf(emoji.name))

            if (aki.progress >= 80 || aki.currentStep >= 78) {
              await aki.win()

              collector.stop()

              interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle(`Este é seu personagem?`)
                    .setDescription(
                      `> **${aki.answers[0].name}**\n\n> ${aki.answers[0].description}\n> Rank: **${aki.answers[0].ranking}**\nResponda com **SIM** caso eu tenha acertado e **NÃO** caso ei não tenha acertado`
                    )
                    .setImage(aki.answers[0].absolute_picture_path)
                    .setThumbnail(`https://i.imgur.com/6MPgU4x.png`),
                ],
              })

              const filter = (m) =>
                /(yes|no|y|n|sim|s)/i.test(m.content) &&
                m.member.id === interaction.member.id

              interaction.channel
                .awaitMessages({
                  filter,
                  max: 1,
                  time: 30000,
                  errors: ['time'],
                })
                .then((collected) => {
                  const isWinner = /yes|y|sim|s/i.test(
                    collected.first().content.toLowerCase()
                  )

                  interaction.editReply({
                    content: isWinner
                      ? `Como esperado de mim, acertei mais uma vez`
                      : `Você ganhou esta partida`,
                    embeds: [],
                  })
                })
                .catch(() => null)
            } else {
              msg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setTitle(`${aki.currentStep + 1}ª Pergunta`)
                    .setThumbnail('https://i.imgur.com/6MPgU4x.png')
                    .addFields({
                      name: aki.question,
                      value: aki.answers
                        .map((x, f) => `${emojis[f]} | ${x}`)
                        .join('\n'),
                    }),
                ],
              })
            }
          })
      })
    })
  },
}
