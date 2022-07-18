const { CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'music',
    description: 'Sistema de Música completa',
    options: [
        {
            name: 'play',
            description: 'Toca uma música',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'nome-link',
                    description:
                        'Nome/link da música',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'volume',
            description: 'Altera o volume.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'porcentagem',
                    description: '20 = 20%',
                    type: 'NUMBER',
                    required: true
                }
            ]
        },
        {
            name: 'settings',
            description: 'Selecione uma das configurações',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'opções',
                    description: 'Selecione uma opção',
                    type: 'STRING',
                    required: true,
                    choices: [
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
                            value: 'shuffle'
                        },
                        {
                            name: '🔃 Ativar o Autoplay',
                            value: 'autoplay'
                        },
                        {
                            name: '🈁 Adicione uma Música Relacionada',
                            value: 'relatedSong'
                        },
                        {
                            name: '🔁 Modo Loop',
                            value: 'repeatMode'
                        }
                    ],
                },
            ],
        },
        {
            name: 'effects',
            description: 'Selecione um dos efeitos',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'efeitos',
                    description: 'Selecione um efeito',
                    type: 'STRING',
                    required: true,
                    choices: [
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
                            value: 'vaporwave'
                        },
                        {
                            name: 'flanger',
                            value: 'flanger'
                        },
                        {
                            name: 'gate',
                            value: 'gate'
                        },
                        {
                            name: 'haas',
                            value: 'haas'
                        },
                        {
                            name: 'reverse',
                            value: 'reverse'
                        },
                        {
                            name: 'surround',
                            value: 'surround'
                        },
                        {
                            name: 'mcompand',
                            value: 'mcompand'
                        },
                        {
                            name: 'phaser',
                            value: 'phaser'
                        },
                        {
                            name: 'tremolo',
                            value: 'tremolo'
                        },
                        {
                            name: 'earwax',
                            value: 'earwax'
                        },
                    ],
                },
            ],
        },
    ],

    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction

        const voiceChannel = member.voice.channel

        if (!voiceChannel) {
            return interaction.reply({
                content:
                    'Você precisa estar em um canal de voz para usar os comandos de música',
                ephemeral: true
            })
        }

        if (
            guild.me.voice.channelId &&
            voiceChannel.id !== guild.me.voice.channelId
        ) {
            return interaction.reply({
                content: `Eu já estou tocando música neste canal: <#${guild.me.voice.channelId
                    }>`,
                ephemeral: true
            })
        }

        try {
            switch (options.getSubcommand()) {
                case 'play': {
                    client.distube.playVoiceChannel(
                        voiceChannel,
                        options.getString('nome-link'),
                        { textChannel: channel, member: member }
                    )

                    return interaction.reply({ content: '🎶 Música recebida' })
                }

                case 'volume': {
                    const volume = options.getNumber('porcentagem')

                    if (volume > 100 || volume < 1) {
                        return interaction.reply({
                            content: 'Você deve especificar um número entre 1 e 100'
                        })
                    }

                    client.distube.setVolume(voiceChannel, volume)

                    return interaction.reply({
                        content: `📶 O volume foi configurado para: \`${volume}%\``
                    })
                }

                case 'settings': {
                    const queue = await client.distube.getQueue(voiceChannel)

                    if (!queue) {
                        return interaction.reply({
                            content: '⛔ - Não tem nenhuma música em fila.'
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
                            return interaction.reply({ embeds: [new MessageEmbed().setColor('PURPLE').setDescription(`${queue.songs.map((song, id) => `\n**${id + 1}** | ${song.name} - \`${song.formattedDuration}\``)}`)] })
                        }

                        case 'shuffle': {
                            await queue.shuffle(voiceChannel)
                            return interaction.reply({ content: '🔀 A fila foi misturada.' })
                        }

                        case 'autoplay': {
                            let mode = await queue.toggleAutoplay(voiceChannel)
                            return interaction.reply({ content: `🔃 O modo autoplay foi ${mode ? 'ativado' : 'desativado'}.` })
                        }

                        case 'relatedSong': {
                            await queue.addRelatedSong(voiceChannel)
                            return interaction.reply({ content: '🈁 Uma música relacionada foi adicionada na fila.' })
                        }

                        case 'repeatMode': {
                            let mode2 = await client.distube.setRepeatMode(queue)
                            return interaction.reply({ content: `🔁 O modo loop foi ${mode2 = mode2 ? mode2 === 2 ? 'ativado para fila' : ' ativado para música' : 'desativado'}.` })
                        }
                    }
                }

                case 'effects': {
                    const queue = await client.distube.getQueue(voiceChannel)

                    if (!queue) {
                        return interaction.reply({
                            content: '⛔ - Não tem nenhuma música em fila.'
                        })
                    }

                    switch (options.getString('efeitos')) {
                        case 'nenhum': {
                            await queue.setFilter(false)
                            return interaction.reply({ content: '📶 Efeitos removidos.' })
                        }

                        case '3d': {
                            await queue.setFilter('3d')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'bassboost': {
                            await queue.setFilter('bassboost')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'echo': {
                            await queue.setFilter('echo')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'karaoke': {
                            await queue.setFilter('karaoke')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'nightcore': {
                            await queue.setFilter('nightcore')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'vaporwave': {
                            await queue.setFilter('vaporwave')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'flanger': {
                            await queue.setFilter('flanger')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'gate': {
                            await queue.setFilter('gate')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'haas': {
                            await queue.setFilter('haas')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'reverse': {
                            await queue.setFilter('reverse')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'surround': {
                            await queue.setFilter('surround')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'mcompand': {
                            await queue.setFilter('mcompand')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'phaser': {
                            await queue.setFilter('phaser')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'tremolo': {
                            await queue.setFilter('tremolo')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }

                        case 'earwax': {
                            await queue.setFilter('earwax')
                            return interaction.reply({ content: '📶 Efeito aplicado.' })
                        }
                    }
                }

            
            }
        } catch (e) {
            const errorEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`⛔ Erro: ${e}`)

            return interaction.reply({ embeds: [errorEmbed] })
        }
    }
}