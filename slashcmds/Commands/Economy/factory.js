const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  EmbedBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')
const economy = require('../../../features/features/economy')

const moment = require('moment')
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders')
require('moment-duration-format')

module.exports = {
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('factory')
    .setDescription('Comandos relacionados ao sistema de fábrica')
    .addSubcommand((options) =>
      options
        .setName('info')
        .setDescription('Mostra as informações da sua fábrica')
    )
    .addSubcommand((options) =>
      options
        .setName('trabalhar')
        .setDescription('Comando para trabalhar na sua fábrica')
    )
    .addSubcommand((options) =>
      options
        .setName('demitir')
        .setDescription('Comando para demitir uma pessoa de sua fábrica')
        .addUserOption((options) =>
          options
            .setName('pessoa')
            .setDescription(
              'Pessoa á ser demitida (Para pedir demissão coloque seu nome)'
            )
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('contratar')
        .setDescription('Comando para contratar alguém para a sua fábrica')
        .addUserOption((options) =>
          options
            .setName('pessoa')
            .setDescription('Pessoa que será contrada')
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('aprimorar')
        .setDescription('Comando para aprimorar/upar a sua fábrica')
    )
    .addSubcommand((options) =>
      options
        .setName('nome')
        .setDescription('Comando para alterar o nome da sua fábrica')
    )
    .addSubcommand((options) =>
      options
        .setName('criar')
        .setDescription('Comando para criar a sua fábrica')
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { options, member } = interaction

    const doc = await profileSchema.findOne({ userId: member.id })

    let owner
    let ownerDoc

    if (doc.factory.hasFactory) {
      owner = await client.users.fetch(doc.factory.owner)
      ownerDoc = await profileSchema.findOne({ userId: owner.id })
    } else {
      owner = null
      ownerDoc = null
    }

    switch (options.getSubcommand()) {
      case 'info': {
        if (!doc.factory.hasFactory) {
          return interaction.reply(
            'Você não tem ou não faz parte de uma fábrica'
          )
        }

        const employees = []
        const list = ownerDoc.factory.employers

        await this.PUSH(employees, list, client)

        //Usando o documento do dono pois tem garantia de haver todas as informações
        const embed = new EmbedBuilder()
          .setTitle(`Informações da Fábrica`)
          .addFields(
            {
              name: `Dono da Fábrica`,
              value: `${owner.tag} ( ${
                2.88e7 - (Date.now() - ownerDoc.factory.lastWork) < 0
                  ? '**Pode Trabalhar**'
                  : `\`${moment
                      .duration(
                        2.88e7 - (Date.now() - ownerDoc.factory.lastWork)
                      )
                      .format('h[h] m[m] s[s]')}\``
              } )`,
            },
            {
              name: 'Nome da Fábrica',
              value:
                ownerDoc.factory.name == 'null'
                  ? 'Nome não Definido'
                  : ownerDoc.factory.name,
            },
            {
              name: `Level`,
              value: `${ownerDoc.factory.level} - XP: ${ownerDoc.factory.exp}/${
                ownerDoc.factory.level * ownerDoc.factory.nextLevel
              }`,
            },
            {
              name: `Funcionários`,
              value: !ownerDoc.factory.employers.length
                ? 'Nenhum Funcionário no Momento'
                : `${employees
                    .map(
                      (x) =>
                        `**\`${x.user.tag}\`** ( ${
                          2.88e7 - (Date.now() - x.lastWork) < 0
                            ? '**Pode Trabalhar**'
                            : `\`${moment
                                .duration(2.88e7 - (Date.now() - x.lastWork))
                                .format('h[h] m[m] s[s]')}\``
                        } )`
                    )
                    .join('\n')}`,
            }
          )

        interaction.reply({ embeds: [embed] })
        break
      }

      case 'trabalhar': {
        if (!doc.factory.hasFactory) {
          return interaction.reply(
            'Você não tem ou não faz parte de uma fábrica'
          )
        }

        let cooldown = 2.88e7 - (Date.now() - doc.factory.lastWork)

        let XP = this.generateRandomNumber(10, 500)
        let COINS =
          this.generateRandomNumber(1000, 10000) *
          doc.factory.level *
          doc.factory.employers.length

        if (cooldown > 0) {
          interaction.reply(
            `Você deve esperar **${moment
              .duration(cooldown)
              .format('h [horas] m [minutos] s [segundos]')
              .replace('minsutos', 'minutos')}** para trabalhar novamente.`
          )
          return
        } else {
          interaction.reply(
            `Você trabalhou com sucesso e conseguiu **${XP}** de xp para a Fábrica e **RC${COINS}** que foram depositados em seu banco`
          )

          await profileSchema.findOneAndUpdate(
            { userId: owner.id },
            { $set: { 'factory.exp': ownerDoc.factory.exp + XP } }
          )

          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            { $set: { 'factory.lastWork': Date.now() } }
          )
          await economy.addBank(member.id, COINS)
        }

        break
      }

      case 'demitir': {
        if (!doc.factory.hasFactory) {
          return interaction.reply(
            'Você não tem ou não faz parte de uma fábrica'
          )
        }

        const user = options.getUser('pessoa')

        //Se a pessoa pedir demissão
        if (user.id == member.id) {
          interaction.reply('Você pediu demissão com sucesso!')
          await profileSchema.findOneAndUpdate(
            {
              userId: owner.id,
            },
            { $pull: { 'factory.employers': member.id } }
          )

          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            {
              $set: {
                'factory.owner': 'null',
                'factory.hasFactory': false,
              },
            }
          )
          return
        } else {
          if (!doc.factory.createFactory) {
            return interaction.reply(
              `${member}, somente o Dono da fábrica pode demitir alguém.`
            )
          }

          if (ownerDoc.factory.employers.some((x) => x != user.id)) {
            interaction.reply('Este usuário não está em sua Fábrica.')
            return
          }
          interaction.reply('Funcionário demitido com sucesso!')
          await profileSchema.findOneAndUpdate(
            {
              userId: member.id,
            },
            { $pull: { 'factory.employers': user.id } }
          )

          await profileSchema.findOneAndUpdate(
            { userId: user.id },
            {
              $set: {
                'factory.owner': 'null',
                'factory.hasFactory': false,
              },
            }
          )
        }
      }

      case 'contratar': {
        const user = options.getUser('pessoa')

        if (!doc.factory.hasFactory) {
          return interaction.reply(
            'Você não tem ou não faz parte de uma fábrica'
          )
        }

        if (!doc.factory.createFactory) {
          return interaction.reply(
            `${member}, somente o Dono da fábrica pode contratar alguém.`
          )
        }

        if (user.bot) {
          return interaction.reply(
            'Você não pode contratar um bot para a sua fábrica'
          )
        }

        const employeeDoc = await profileSchema.findOne({ userId: user.id })

        if (employeeDoc.factory.hasFactory) {
          return interaction.reply('Esse membro já está em um Fábrica.')
        }

        const row = new ActionRowBuilder()

        const yesButton = new ButtonBuilder()
          .setCustomId('yes')
          .setLabel('Aceita')
          .setStyle(ButtonStyle.Success)
          .setDisabled(false)

        const noButton = new ButtonBuilder()
          .setCustomId('no')
          .setLabel('Cancela')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(false)

        row.addComponents([yesButton, noButton])

        const msg = await interaction.reply({
          content: `${user}, o(a) ${member} está tentando lhe contratar, aceitas?`,
          components: [row],
        })

        let collect

        const collector = msg.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 60000,
        })

        collector.on('collect', async (x) => {
          if (x.user.id == user.id) {
            collect = x

            switch (x.customId) {
              case 'yes': {
                interaction.channel.send(
                  `Você contratou com sucesso o(a) ${user}`
                )

                await profileSchema.findOneAndUpdate(
                  {
                    userId: member.id,
                  },
                  { $push: { 'factory.employers': user.id } }
                )

                await profileSchema.findOneAndUpdate(
                  { userId: user.id },
                  {
                    $set: {
                      'factory.owner': member.id,
                      'factory.hasFactory': true,
                      'factory.lastWork': 0,
                    },
                    $push: { 'factory.employers': user.id },
                  }
                )
                await profileSchema.findOneAndUpdate(
                  { userId: user.id },
                  { $push: { 'factory.employers': member.id } }
                )

                interaction.deleteReply()
                collector.stop()
                break
              }
              case 'no': {
                interaction.channel.send(`O(a) ${user} recusou o pedido.`)
                interaction.deleteReply()
                collector.stop()
                break
              }
            }
          }
        })

        collector.on('end', (x) => {
          if (collect) return
          //   x.update({ components: [] })
        })

        break
      }

      case 'aprimorar': {
        if (!doc.factory.hasFactory) {
          return interaction.reply(
            'Você não tem ou não faz parte de uma fábrica'
          )
        }

        if (!doc.factory.createFactory) {
          return interaction.reply(
            `${member}, somente o Dono da fábrica pode upar a fábrica.`
          )
        }

        if (
          ownerDoc.factory.nextLevel * ownerDoc.factory.level >
          ownerDoc.factory.exp
        )
          return interaction.reply(
            `${member}, a fábrica não tem xp o suficiente para upar de level.`
          )

        interaction.reply(`${member}, fábrica aprimorada com sucesso.`)

        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          {
            $set: {
              'factory.level': ownerDoc.factory.level + 1,
              'factory.exp':
                ownerDoc.factory.exp -
                ownerDoc.factory.nextLevel * ownerDoc.factory.level,
            },
          }
        )

        break
      }

      case 'criar': {
        if (doc.factory.hasFactory) {
          return interaction.reply('Você já tem ou faz parte de uma fábrica')
        }
        if ((await economy.getCoins(member.id)) < 20000) {
          interaction.reply(
            'Você precisa de **RC20.000** em mãos para criar uma Fábrica!'
          )
          return
        }

        interaction.reply('Sua fábrica foi criada com sucesso!')
        await economy.addCoins(member.id, 20000 * -1)
        await profileSchema.findOneAndUpdate(
          { userId: member.id },
          {
            $set: {
              'factory.name': 'null',
              'factory.exp': 0,
              'factory.level': 1,
              'factory.nextLevel': 500,
              'factory.owner': member.id,
              'factory.employers': [],
              'factory.hasFactory': true,
              'factory.createFactory': true,
              'factory.lastWork': 0,
            },
          }
        )

        break
      }
    }
  },

  async PUSH(members, list, client) {
    for (const employer of list) {
      const doc = await profileSchema
        .findOne({ userId: employer })
        .then((x) => x.factory)
      members.push({
        user: await client.users.fetch(employer).then((user) => {
          return user
        }),
        lastWork: doc.lastWork,
      })
    }
  },

  generateRandomNumber(min, max) {
    min = Math.ceil(min)
    max = Math.ceil(max)

    return Math.floor(Math.random() * (max - min + 1)) + min
  },
}
