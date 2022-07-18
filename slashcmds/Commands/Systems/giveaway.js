const { CommandInteraction, MessageEmbed, Client } = require('discord.js')
const ms = require('ms')

module.exports = {
  name: 'giveaway',
  description: 'Um sistema de sorteios',
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: 'start',
      description: 'Inicia o sorteio',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'duração',
          description:
            'Escolha uma duração para este sorteio (m = minutos, h = horas, d = dias)',
          type: 'STRING',
          required: true,
        },
        {
          name: 'ganhadores',
          description: 'Selecione a quatidade de ganhadores para este sorteio',
          type: 'INTEGER',
          required: true,
        },
        {
          name: 'prêmio',
          description: 'O que a pessoa ganhará',
          type: 'STRING',
          required: true,
        },
        {
          name: 'canal',
          description: 'Selecione o canal para mandar o sorteio',
          type: 'CHANNEL',
          channelTypes: ['GUILD_TEXT'],
        },
      ],
    },
    {
      name: 'actions',
      description: 'Opções para sorteios',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'opções',
          description: 'Selecione uma opção',
          type: 'STRING',
          required: true,
          choices: [
            {
              name: 'terminar',
              value: 'terminar',
            },
            {
              name: 'pausar',
              value: 'pausar',
            },
            {
              name: 'despausar',
              value: 'despasar',
            },
            {
              name: 'reroll',
              value: 'reroll',
            },
            {
              name: 'deletar',
              value: 'deletar',
            },
          ],
        },
        {
          name: 'message-id',
          description: 'O id da mensagem do sorteio.',
          type: 'STRING',
          required: true,
        },
      ],
    },
  ],

  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { options } = interaction

    const sub = options.getSubcommand()

    const errorEmbed = new MessageEmbed().setColor('RED')

    const sucessEmbed = new MessageEmbed().setColor('#8000FF')

    switch (sub) {
      case 'start':
        {
          const gchannel = options.getChannel('canal') || interaction.channel
          const duration = options.getString('duração')
          const winnerCount = options.getInteger('ganhadores')
          const prize = options.getString('prêmio')

          client.giveawaysManager
            .start(gchannel, {
              duration: ms(duration),
              winnerCount,
              prize,
              messages: {
                giveaway: '🎉🎉 **SORTEIO** 🎉🎉',
                giveawayEnded: '🎉🎉 **O sorteio acabou** 🎉🎉',
                drawing: 'Sorteando em: {timestamp}',
                dropMessage: 'Seja o primeiro á reagir com 🎉 !',
                inviteToParticipate: 'Reaja com 🎉 para participar!',
                winMessage:
                  'Parabéns, {winners}! Você ganhou **{this.prize}**!',
                embedFooter: '{this.winnerCount} ganhador(es)',
                noWinner: 'Sorteio cancelado, sem participações válidas.',
                hostedBy: 'Organizado por: {this.hostedBy}',
                winners: 'Ganhador(a)(es):',
                endedAt: 'Sorteado em',
              },
            })
            .then(async () => {
              sucessEmbed.setDescription('O sorteio foi iniciado com sucesso.')
              return interaction.reply({
                embeds: [sucessEmbed],
                ephemeral: true,
              })
            })
            .catch((err) => {
              errorEmbed.setDescription(`Um erro ocorreu \n\`${err}\``)
              return interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true,
              })
            })
        }
        break

      case 'actions':
        {
          const choice = options.getString('opções')
          const messageId = options.getString('message-id')

          const giveaway = client.giveawaysManager.giveaways.find(
            (g) =>
              g.guildId === interaction.guildId && g.messageId === messageId
          )

          if (!giveaway) {
            errorEmbed.setDescription(
              `Não achei nenhum sorteio com o id : ${messageId}`
            )
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
          }

          switch (choice) {
            case 'terminar':
              {
                client.giveawaysManager
                  .end(messageId)
                  .then(() => {
                    sucessEmbed.setDescription('Sorteio terminado com sucesso')
                    return interaction.reply({
                      embeds: [sucessEmbed],
                      ephemeral: true,
                    })
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`Um erro ocorreu \n\`${err}\``)
                    return interaction.reply({
                      embeds: [errorEmbed],
                      ephemeral: true,
                    })
                  })
              }
              break

            case 'pausar':
              {
                client.giveawaysManager
                  .pause(messageId)
                  .then(() => {
                    sucessEmbed.setDescription('Sorteio pausado com sucesso')
                    return interaction.reply({
                      embeds: [sucessEmbed],
                      ephemeral: true,
                    })
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`Um erro ocorreu \n\`${err}\``)
                    return interaction.reply({
                      embeds: [errorEmbed],
                      ephemeral: true,
                    })
                  })
              }
              break

            case 'despausar':
              {
                client.giveawaysManager
                  .unpause(messageId)
                  .then(() => {
                    sucessEmbed.setDescription('Sorteio despausado com sucesso')
                    return interaction.reply({
                      embeds: [sucessEmbed],
                      ephemeral: true,
                    })
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`Um erro ocorreu \n\`${err}\``)
                    return interaction.reply({
                      embeds: [errorEmbed],
                      ephemeral: true,
                    })
                  })
              }
              break

            case 'reroll':
              {
                client.giveawaysManager
                  .reroll(messageId, {
                    messages: {
                      congrat:
                        ':tada: Novo ganhador(es)(s): {winners}! Parabéns, você ganhou **{this.prize}**!\n{this.messageURL}',
                      error:
                        'Sem participantes válidos, não é possível escolher um novo ganhador!',
                    },
                  })
                  .then(() => {
                    sucessEmbed.setDescription('Resorteado com sucesso')
                    return interaction.reply({
                      embeds: [sucessEmbed],
                      ephemeral: true,
                    })
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`Um erro ocorreu \n\`${err}\``)
                    return interaction.reply({
                      embeds: [errorEmbed],
                      ephemeral: true,
                    })
                  })
              }
              break

            case 'deletar':
              {
                client.giveawaysManager
                  .delete(messageId)
                  .then(() => {
                    sucessEmbed.setDescription('Sorteio deletado com sucesso')
                    interaction.reply({
                      embeds: [sucessEmbed],
                      ephemeral: true,
                    })
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`Um erro ocorreu \n\`${err}\``)
                    return interaction.reply({
                      embeds: [errorEmbed],
                      ephemeral: true,
                    })
                  })
              }
              break
          }
        }
        break

      default: {
        console.log('Erro no sorteio')
      }
    }
  },
}
