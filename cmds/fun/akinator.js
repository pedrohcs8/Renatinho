const { MessageAttachment, MessageEmbed } = require('discord.js')
const Command = require('@util/structures/Command')
const Emojis = require('@util/Emojis')
const { Aki } = require('aki-api')
const akinator = new Set()

module.exports = class AkinatorCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'akinator'
    this.category = 'Fun'
    this.description = 'Comando para jogar com o akinator'
    this.usage = 'akinator'
    this.aliases = ['akinator', 'aki']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const emojis = [
      Emojis.Certo,
      Emojis.Errado,
      Emojis.Help,
      Emojis.Thinking,
      Emojis.Angry,
      Emojis.Aki_Cancel,
    ]

    if (akinator.has(message.author.id)) {
      message.reply('Você já tem uma partida em andamento')
      return
    }
    akinator.add(message.author.id)

    message.reply('Estou começando sua partida!').then(async (x) => {
      //Iniciar o genio
      const region = 'pt'
      const aki = new Aki(region)
      await aki.start()
      //Iniciar o genio

      const embed = new MessageEmbed()
        .setTitle(`${aki.currentStep + 1}ª Pergunta`)
        .setThumbnail('https://i.imgur.com/6MPgU4x.png')
        .addField(
          aki.question,
          aki.answers.map((x, f) => `${emojis[f]} | ${x}`).join('\n'),
        )

      message.reply({ embeds: [embed] }).then(async (msg) => {
        x.delete()
        for (const emoji of emojis) await msg.react(emoji)

        const collector = msg.createReactionCollector(
          (reaction, user) =>
            emojis.includes(reaction.emoji.name) &&
            user.id === message.author.id,
          {
            time: 60000 * 10,
          },
        )

        collector
          .on('end', () => akinator.delete(message.author.id))
          .on('collect', async ({ emoji, users }) => {
            users.remove(message.author).catch(() => null)

            if (emoji.name === Emojis.Aki_Cancel) return collector.stop()

            await aki.step(emojis.indexOf(emoji.name))

            if (aki.progress >= 80 || aki.currentStep >= 78) {
              await aki.win()

              collector.stop()

              message.reply({
                embeds: [
                  new MessageEmbed()
                    .setTitle(`Este é seu personagem?`)
                    .setDescription(
                      `> **${aki.answers[0].name}**\n\n> ${aki.answers[0].description}\n> Rank: **${aki.answers[0].ranking}**\nResponda com **SIM** caso eu tenha acertado e **NÃO** caso ei não tenha acertado`,
                    )
                    .setImage(aki.answers[0].absolute_picture_path)
                    .setThumbnail(`https://i.imgur.com/6MPgU4x.png`),
                ],
              })

              const filter = (m) =>
              /(yes|no|y|n|sim|s)/i.test(m.content) &&
              m.author.id === message.author.id;

            message.channel
              .awaitMessages({filter,
                max: 1,
                time: 30000,
                errors: ["time"],
              })
              .then((collected) => {
                const isWinner = /yes|y|sim|s/i.test(
                  collected.first().content
                );

                message.reply(
                  isWinner
                    ? `Como esperado de mim, acertei mais uma vez`
                    : `Você ganhou esta partida`
                );
              })
              .catch(() => null);
            } else {
              msg.edit({
                embeds: [
                  new MessageEmbed()
                    .setTitle(`${aki.currentStep + 1}ª Pergunta`)
                    .setThumbnail('https://imgur.com/6MPgU4x')
                    .addField(
                      aki.question,
                      aki.answers
                        .map((x, f) => `${emojis[f]} | ${x}`)
                        .join('\n'),
                    ),
                ],
              })
            }
          })
      })
    })
  }
}
