﻿const {
  ChatInputCommandInteraction,
  Client,
  MessageEmbed,
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require('discord.js')

const guildSchema = require('@schemas/guild-schema')

const { google } = require('googleapis')
const fetch = require('isomorphic-unfetch')
const { getData, getPreview, getTracks, getDetails } =
  require('spotify-url-info')(fetch)

const ytApiKey = process.env.YOUTUBE_API
// Create a new YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: ytApiKey,
})

module.exports = {
  category: 'Música',
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
    )
    .addSubcommand((options) =>
      options
        .setName('canalpermitido')
        .setDescription('Configure o canal habilitado para comandos de música')
        .addChannelOption((options) =>
          options
            .setName('canal-texto')
            .setDescription('Canal de texto permitido')
            .setRequired(true)
        )
        .addChannelOption((options) =>
          options
            .setName('canal-voz')
            .setDescription('Canal de voz permitido')
            .setRequired(true)
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

    if (!options.getSubcommand() == 'canalpermitido') {
      if (!voiceChannel) {
        return interaction.editReply({
          content:
            'Você precisa estar em um canal de voz para usar os comandos de música',
          ephemeral: true,
        })
      }
    }

    try {
      console.log(`Music Command: ${options.getSubcommand()}`)

      switch (options.getSubcommand()) {
        case 'play': {
          const data = await guildSchema.findOne({ idS: guild.id })

          if (data.musicChannels.textChannel == '') {
            return interaction.reply(
              'Este servidor não tem um canal configurado para os comandos de música! Configure com /music canalpermitido'
            )
          } else if (
            interaction.channel.id != data.musicChannels.textChannel ||
            interaction.member.voice.channel.id !=
              data.musicChannels.voiceChannel
          ) {
            return interaction.reply({
              content: 'Este comando não é permitido neste canal/call.',
              flags: MessageFlags.Ephemeral,
            })
          }

          try {
            await interaction.deferReply()
          } catch (error) {
            return console.log(error)
          }

          const query = options.getString('nome-link')

          if (query.includes('youtube.com/playlist')) {
            const isPublic = await isPlaylistPublic(query)

            if (isPublic) {
              client.distube.play(voiceChannel, query, {
                member: member,
                textChannel: channel,
              })
            } else {
              return interaction.editReply({
                content: '⛔ - A Playlist precisa ser pública',
              })
            }
          } else if (query.includes('open.spotify.com/playlist')) {
            const playlist = await getTracks(query)
            const title = (await getPreview(query)).title

            let arrSongs = []

            for (const track of playlist) {
              const searchResults = await client.ytPlugin.search(
                `${track.name} - ${track.artist.name}`
              )
              const song = searchResults[0]
              arrSongs.push(song)
            }

            const customplaylist = await client.distube.createCustomPlaylist(
              arrSongs,
              {
                member: member,
                properties: { name: title },
                parallel: true,
              }
            )

            client.distube.play(voiceChannel, customplaylist, {
              member: member,
              textChannel: channel,
            })

            return interaction.editReply({ content: '🎶 Playlist Recebida' })
          } else if (query.includes('open.spotify.com/')) {
            //Problematic Query Check
            if (query.includes('/collection/tracks')) {
              return interaction.editReply({
                content:
                  '⛔ - Link Invalido, tente usar o botao de compartilhar',
              })
            }

            try {
              client.distube.play(voiceChannel, query, {
                member: member,
                textChannel: channel,
              })

              return interaction.editReply({ content: '🎶 Música recebida' })
            } catch (e) {
              console.log(e)

              return interaction.editReply({
                content: '⛔ - Erro Carregando Musica do Spotify',
              })
            }
          } else if (query.includes('music.youtube.com')) {
            return interaction.editReply('⛔ - Não aceitamos o Youtube Music!')
          } else {
            let found

            if (query.includes('https://')) {
              client.distube.play(voiceChannel, query, {
                member: member,
                textChannel: channel,
              })

              return interaction.editReply({ content: '🎶 Música recebida' })
            }

            try {
              found = await client.ytPlugin.search(query)
            } catch (e) {
              if (e == 'DisTubeError [NO_RESULT]: No result found') {
                return interaction.editReply({
                  content: '⛔ - Não Consegui Encontrar esta música',
                })
              } else {
                return interaction.editReply({
                  content:
                    '⛔ - Erro procurando esta música, verifique o link ou contate o desenvolvedor.',
                })
              }
            }

            if (found.length) {
              client.distube.play(voiceChannel, query, {
                member: member,
                textChannel: channel,
              })

              return interaction.editReply({ content: '🎶 Música recebida' })
            } else {
              return interaction.editReply(
                '⛔ - Música não encontrada, verifique o link ou o nome'
              )
            }
          }
        }

        case 'volume': {
          try {
            await interaction.deferReply()
          } catch (error) {
            return console.log(error)
          }

          const volume = options.getNumber('porcentagem')

          if (volume > 100 || volume < 1) {
            return interaction.editReply({
              content: 'Você deve especificar um número entre 1 e 100',
            })
          }

          client.distube.setVolume(voiceChannel, volume)

          return interaction.editReply({
            content: `📶 O volume foi configurado para: \`${volume}%\``,
          })
        }

        case 'canalpermitido': {
          const textChannel = options.getChannel('canal-texto')
          const voiceChannel = options.getChannel('canal-voz')

          if (textChannel.isVoiceBased()) {
            return interaction.reply('O canal selecionado não é de texto')
          }

          if (!voiceChannel.isVoiceBased()) {
            return interaction.reply('O canal selecionado não é de voz')
          }

          await guildSchema.findOneAndUpdate(
            { idS: guild.id },
            {
              musicChannels: {
                textChannel: textChannel.id,
                voiceChannel: voiceChannel.id,
              },
            }
          )

          return interaction.reply('Canal alterado/configurado com sucesso!')
        }

        case 'settings': {
          try {
            await interaction.deferReply()
          } catch (error) {
            return console.log(error)
          }

          const queue = await client.distube.getQueue(voiceChannel)

          if (!queue) {
            return interaction.editReply({
              content: '⛔ - Não tem nenhuma música em fila.',
            })
          }

          switch (options.getString('opções')) {
            case 'skip': {
              await queue.skip(voiceChannel)
              return interaction.editReply({ content: '⏩ Música skipada.' })
            }

            case 'stop': {
              await queue.stop(voiceChannel)
              queue.voice.leave()
              return interaction.editReply({ content: '⏹️ Música parada.' })
            }

            case 'pause': {
              await queue.pause(voiceChannel)
              return interaction.editReply({ content: '⏸️ Música pausada.' })
            }

            case 'resume': {
              await queue.resume(voiceChannel)
              return interaction.editReply({ content: '▶️ Música despausada.' })
            }

            case 'queue': {
              return interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(process.env.EMBED_COLOR)
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
              return interaction.editReply({
                content: '🔀 A fila foi misturada.',
              })
            }

            case 'autoplay': {
              let mode = await queue.toggleAutoplay(voiceChannel)
              return interaction.editReply({
                content: `🔃 O modo autoplay foi ${
                  mode ? 'ativado' : 'desativado'
                }.`,
              })
            }

            case 'relatedSong': {
              await queue.addRelatedSong(voiceChannel)
              return interaction.editReply({
                content: '🈁 Uma música relacionada foi adicionada na fila.',
              })
            }

            case 'repeatMode': {
              let mode2 = await client.distube.setRepeatMode(queue)
              return interaction.editReply({
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
          try {
            await interaction.deferReply()
          } catch (error) {
            return console.log(error)
          }

          const queue = await client.distube.getQueue(voiceChannel)

          if (!queue) {
            return interaction.editReply({
              content: '⛔ - Não tem nenhuma música em fila.',
            })
          }

          switch (options.getString('efeitos')) {
            case 'nenhum': {
              queue.filters.clear()
              return await interaction.editReply({
                content: '📶 Efeitos removidos.',
              })
            }

            case '3d': {
              if (queue.filters.has('3d')) {
                queue.filters.remove('3d')
                return await interaction.editReply({
                  content: '📶 Efeito ``3d`` removido.',
                })
              } else {
                queue.filters.add('3d')
                return await interaction.editReply({
                  content: '📶 Efeito ``3d`` aplicado.',
                })
              }
            }

            case 'bassboost': {
              if (queue.filters.has('bassboost')) {
                queue.filters.remove('bassboost')
                return await interaction.editReply({
                  content: '📶 Efeito ``bassboost`` removido.',
                })
              } else {
                queue.filters.add('bassboost')
                return await interaction.editReply({
                  content: '📶 Efeito ``bassboost`` aplicado.',
                })
              }
            }

            case 'echo': {
              if (queue.filters.has('echo')) {
                queue.filters.remove('echo')
                return await interaction.editReply({
                  content: '📶 Efeito ``echo`` removido.',
                })
              } else {
                queue.filters.add('echo')
                return await interaction.editReply({
                  content: '📶 Efeito ``echo`` aplicado.',
                })
              }
            }

            case 'karaoke': {
              if (queue.filters.has('karaoke')) {
                queue.filters.remove('karaoke')
                return await interaction.editReply({
                  content: '📶 Efeito ``karaoke`` removido.',
                })
              } else {
                queue.filters.add('karaoke')
                return await interaction.editReply({
                  content: '📶 Efeito ``karaoke`` aplicado.',
                })
              }
            }

            case 'nightcore': {
              if (queue.filters.has('nightcore')) {
                queue.filters.remove('nightcore')
                return await interaction.editReply({
                  content: '📶 Efeito ``nightcore`` removido.',
                })
              } else {
                queue.filters.add('nightcore')
                return await interaction.editReply({
                  content: '📶 Efeito ``nightcore`` aplicado.',
                })
              }
            }

            case 'vaporwave': {
              if (queue.filters.has('vaporwave')) {
                queue.filters.remove('vaporwave')
                return await interaction.editReply({
                  content: '📶 Efeito ``vaporwave`` removido.',
                })
              } else {
                queue.filters.add('vaporwave')
                return await interaction.editReply({
                  content: '📶 Efeito ``vaporwave`` aplicado.',
                })
              }
            }

            case 'flanger': {
              if (queue.filters.has('flanger')) {
                queue.filters.remove('flanger')
                return await interaction.editReply({
                  content: '📶 Efeito ``flanger`` removido.',
                })
              } else {
                queue.filters.add('flanger')
                return await interaction.editReply({
                  content: '📶 Efeito ``flanger`` aplicado.',
                })
              }
            }

            case 'gate': {
              if (queue.filters.has('gate')) {
                queue.filters.remove('gate')
                return await interaction.editReply({
                  content: '📶 Efeito ``gate`` removido.',
                })
              } else {
                queue.filters.add('gate')
                return await interaction.editReply({
                  content: '📶 Efeito ``gate`` aplicado.',
                })
              }
            }

            case 'haas': {
              if (queue.filters.has('haas')) {
                queue.filters.remove('haas')
                return await interaction.editReply({
                  content: '📶 Efeito ``haas`` removido.',
                })
              } else {
                queue.filters.add('haas')
                return await interaction.editReply({
                  content: '📶 Efeito ``haas`` aplicado.',
                })
              }
            }

            case 'reverse': {
              if (queue.filters.has('reverse')) {
                queue.filters.remove('reverse')
                return await interaction.editReply({
                  content: '📶 Efeito ``reverse`` removido.',
                })
              } else {
                queue.filters.add('reverse')
                return await interaction.editReply({
                  content: '📶 Efeito ``reverse`` aplicado.',
                })
              }
            }

            case 'surround': {
              if (queue.filters.has('surround')) {
                queue.filters.remove('surround')
                return await interaction.editReply({
                  content: '📶 Efeito ``surround`` removido.',
                })
              } else {
                queue.filters.add('surround')
                return await interaction.editReply({
                  content: '📶 Efeito ``surround`` aplicado.',
                })
              }
            }

            case 'mcompand': {
              if (queue.filters.has('mcompand')) {
                queue.filters.remove('mcompand')
                return await interaction.editReply({
                  content: '📶 Efeito ``mcompand`` removido.',
                })
              } else {
                queue.filters.add('mcompand')
                return await interaction.editReply({
                  content: '📶 Efeito ``mcompand`` aplicado.',
                })
              }
            }

            case 'phaser': {
              if (queue.filters.has('phaser')) {
                queue.filters.remove('phaser')
                return await interaction.editReply({
                  content: '📶 Efeito ``phaser`` removido.',
                })
              } else {
                queue.filters.add('phaser')
                return await interaction.editReply({
                  content: '📶 Efeito ``phaser`` aplicado.',
                })
              }
            }

            case 'tremolo': {
              if (queue.filters.has('tremolo')) {
                queue.filters.remove('tremolo')
                return await interaction.editReply({
                  content: '📶 Efeito ``tremolo`` removido.',
                })
              } else {
                queue.filters.add('tremolo')
                return await interaction.editReply({
                  content: '📶 Efeito ``tremolo`` aplicado.',
                })
              }
            }

            case 'earwax': {
              if (queue.filters.has('earwax')) {
                queue.filters.remove('earwax')
                return await interaction.editReply({
                  content: '📶 Efeito ``earwax`` removido.',
                })
              } else {
                queue.filters.add('earwax')
                return await interaction.editReply({
                  content: '📶 Efeito ``earwax`` aplicado.',
                })
              }
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

async function isPlaylistPublic(playlistUrl) {
  // Extract the playlist ID from the URL
  const playlistId = playlistUrl.match(/list=(.*)/)[1]

  try {
    // Get the playlist details from the YouTube API
    const playlist = await youtube.playlists.list({
      part: 'status',
      id: playlistId,
    })

    // Check the playlist privacy status
    return playlist.data.items[0].status.privacyStatus === 'public'
  } catch (err) {
    console.error(err)
    return false
  }
}
