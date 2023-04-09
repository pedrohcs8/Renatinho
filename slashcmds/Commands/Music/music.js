const {
  ChatInputCommandInteraction,
  Client,
  MessageEmbed,
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js')

module.exports = {
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Sistema de Música')
    .setDMPermission(false)
    .addSubcommand((options) =>
      options
        .setName('play')
        .setDescription('Toca uma música')
        .addStringOption((options) =>
          options
            .setName('nome-link')
            .setDescription('Nome-link da música')
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('volume')
        .setDescription('Volume da música')
        .addNumberOption((options) =>
          options
            .setName('porcentagem')
            .setDescription('20 = 20%')
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('settings')
        .setDescription('Configurações do sistema de música')
        .addStringOption((options) =>
          options
            .setName('opções')
            .setDescription('Selecione uma opção')
            .setRequired(true)
            .addChoices(
              {
                name: '🔢 Fila',
                value: 'queue',
              },
              {
                name: '⏩ Pular a Música',
                value: 'skip',
              },
              {
                name: '⏸️ Pausar a Música',
                value: 'pause',
              },
              {
                name: '▶️ Despausar a música',
                value: 'resume',
              },
              {
                name: '⏹️ Parar a Música',
                value: 'stop',
              },
              {
                name: '🔀 Misturar as Músicas',
                value: 'shuffle',
              },
              {
                name: '🔃 Ativar o Autoplay',
                value: 'autoplay',
              },
              {
                name: '🈁 Adicione uma Música Relacionada',
                value: 'relatedSong',
              },
              {
                name: '🔁 Modo Loop',
                value: 'repeatMode',
              }
            )
        )
    )
    .addSubcommand((options) =>
      options
        .setName('effects')
        .setDescription('Selecione um dos efeitos')
        .addStringOption((options) =>
          options
            .setName('efeitos')
            .setDescription('Selecione um efeito')
            .setRequired(true)
            .addChoices(
              {
                name: 'nenhum',
                value: 'nenhum',
              },
              {
                name: '3d',
                value: '3d',
              },
              {
                name: 'bassboost',
                value: 'bassboost',
              },
              {
                name: 'echo',
                value: 'echo',
              },
              {
                name: 'karaoke',
                value: 'karaoke',
              },
              {
                name: 'nightcore',
                value: 'nightcore',
              },
              {
                name: 'vaporwave',
                value: 'vaporwave',
              },
              {
                name: 'flanger',
                value: 'flanger',
              },
              {
                name: 'gate',
                value: 'gate',
              },
              {
                name: 'haas',
                value: 'haas',
              },
              {
                name: 'reverse',
                value: 'reverse',
              },
              {
                name: 'surround',
                value: 'surround',
              },
              {
                name: 'mcompand',
                value: 'mcompand',
              },
              {
                name: 'phaser',
                value: 'phaser',
              },
              {
                name: 'tremolo',
                value: 'tremolo',
              },
              {
                name: 'earwax',
                value: 'earwax',
              }
            )
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */

  async execute(interaction, client) {
    const { options, member, guild, channel } = interaction

    const voiceChannel = member.voice.channel

    if (!voiceChannel) {
      return interaction.reply({
        content:
          'Você precisa estar em um canal de voz para usar os comandos de música',
        ephemeral: true,
      })
    }

    try {
      console.log(options.getSubcommand())

      switch (options.getSubcommand()) {
        case 'play': {
          client.distube.play(voiceChannel, options.getString('nome-link'), {
            member: member,
            textChannel: channel,
          })

          return interaction.reply({ content: '🎶 Música recebida' })
        }

        case 'volume': {
          const volume = options.getNumber('porcentagem')

          if (volume > 100 || volume < 1) {
            return interaction.reply({
              content: 'Você deve especificar um número entre 1 e 100',
            })
          }

          client.distube.setVolume(voiceChannel, volume)

          return interaction.reply({
            content: `📶 O volume foi configurado para: \`${volume}%\``,
          })
        }

        case 'settings': {
          const queue = await client.distube.getQueue(voiceChannel)

          if (!queue) {
            return interaction.reply({
              content: '⛔ - Não tem nenhuma música em fila.',
            })
          }

          switch (options.getString('opções')) {
            case 'skip': {
              await queue.skip(voiceChannel)
              return interaction.reply({ content: '⏩ Música skipada.' })
            }

            case 'stop': {
              await queue.stop(voiceChannel)
              await queue.stop(voiceChannel)
              return interaction.reply({ content: '⏹️ Música parada.' })
            }

            case 'pause': {
              await queue.pause(voiceChannel)
              return interaction.reply({ content: '⏸️ Música pausada.' })
            }

            case 'resume': {
              await queue.resume(voiceChannel)
              return interaction.reply({ content: '▶️ Música despausada.' })
            }

            case 'queue': {
              return interaction.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor('PURPLE')
                    .setDescription(
                      `${queue.songs.map(
                        (song, id) =>
                          `\n**${id + 1}** | ${song.name} - \`${
                            song.formattedDuration
                          }\``
                      )}`
                    ),
                ],
              })
            }

            case 'shuffle': {
              await queue.shuffle(voiceChannel)
              return interaction.reply({ content: '🔀 A fila foi misturada.' })
            }

            case 'autoplay': {
              let mode = await queue.toggleAutoplay(voiceChannel)
              return interaction.reply({
                content: `🔃 O modo autoplay foi ${
                  mode ? 'ativado' : 'desativado'
                }.`,
              })
            }

            case 'relatedSong': {
              await queue.addRelatedSong(voiceChannel)
              return interaction.reply({
                content: '🈁 Uma música relacionada foi adicionada na fila.',
              })
            }

            case 'repeatMode': {
              let mode2 = await client.distube.setRepeatMode(queue)
              return interaction.reply({
                content: `🔁 O modo loop foi ${(mode2 = mode2
                  ? mode2 === 2
                    ? 'ativado para fila'
                    : ' ativado para música'
                  : 'desativado')}.`,
              })
            }
          }
        }

        case 'effects': {
          const queue = await client.distube.getQueue(voiceChannel)

          if (!queue) {
            return interaction.reply({
              content: '⛔ - Não tem nenhuma música em fila.',
            })
          }

          switch (options.getString('efeitos')) {
            case 'nenhum': {
              await queue.filters.clear()
              return interaction.reply({ content: '📶 Efeitos removidos.' })
            }

            case '3d': {
              await queue.filters.add('3d')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'bassboost': {
              await queue.filters.add('bassboost')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'echo': {
              await queue.filters.add('echo')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'karaoke': {
              await queue.filters.add('karaoke')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'nightcore': {
              await queue.filters.add('nightcore')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'vaporwave': {
              await queue.filters.add('vaporwave')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'flanger': {
              await queue.filters.add('flanger')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'gate': {
              await queue.filters.add('gate')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'haas': {
              await queue.filters.add('haas')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'reverse': {
              await queue.filters.add('reverse')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'surround': {
              await queue.filters.add('surround')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'mcompand': {
              await queue.filters.add('mcompand')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'phaser': {
              await queue.filters.add('phaser')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'tremolo': {
              await queue.filters.add('tremolo')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }

            case 'earwax': {
              await queue.filters.add('earwax')
              return interaction.reply({ content: '📶 Efeito aplicado.' })
            }
          }
        }
      }
    } catch (e) {
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`⛔ Erro: ${e}`)

      return interaction.reply({ embeds: [errorEmbed] })
    }
  },
}
