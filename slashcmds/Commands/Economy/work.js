const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require('discord.js')
const profileSchema = require('../../../schemas/profile-schema')
const { EmbedBuilder } = require('@discordjs/builders')
const moment = require('moment')
require('moment-duration-format')

module.exports = {
  subsincluded: true,
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Comando para trabalhar na sua empresa')
    .addSubcommand((options) =>
      options.setName('info').setDescription('Informações da sua empresa')
    )
    .addSubcommand((options) =>
      options
        .setName('name')
        .setDescription('Informações do seu trabalho')
        .addStringOption((options) =>
          options
            .setName('nome')
            .setDescription('O novo nome da sua empresa')
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName('trabalhar')
        .setDescription('Comando para trabalhar na sua empresa')
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, member } = interaction

    const userData = await profileSchema.findOne({ userId: member.id })

    switch (options.getSubcommand()) {
      case 'info': {
        const workData = userData.work
        let money = Math.ceil(workData.level * 2 * workData.coins + 200)
        let cooldown = 2.88e7
        let cool = workData.cooldown

        const embed = new EmbedBuilder()
          .setAuthor({ name: `Empresa de ${member.user.username}` })
          .setThumbnail(
            member.displayAvatarURL({
              size: 2048,
              format: 'jpeg',
            })
          )
          .setColor(0x8000ff)
          .addFields(
            {
              name: 'Nome da Empresa',
              value:
                workData.name == 'null' ? 'Nome não definido' : workData.name,
            },
            {
              name: 'Level/XP',
              value: `#${workData.level} - ${workData.exp}/${
                workData.level * workData.nextLevel
              }`,
            },
            {
              name: 'Salário',
              value: `${money.toLocaleString()} renatocoins`,
            },
            {
              name: 'Cooldown',
              value:
                cooldown - (Date.now() - cool) < 0
                  ? 'Pode Trabalhar'
                  : moment
                      .duration(cooldown - (Date.now() - cool))
                      .format('h [horas], m [minutos] e s [segundos]')
                      .replace('minsutos', 'minutos'),
            },
            {
              name: 'Helpzinho',
              value:
                '> work info - Abre esse Menu\n> work - Trabalha\n> work name - Muda o nome de sua empresa',
            }
          )

        interaction.reply({ embeds: [embed] })
        break
      }

      case 'name': {
        const work = userData.work
        const name = options.getString('nome')

        if (name === work.name) {
          return interaction.reply('O nome inserido é igual ao atual')
        } else if (name.length > 25) {
          return interaction.reply(
            'O nome inserido é muito grande, tente novamente com 25 ou menos caracteres.'
          )
        } else {
          interaction.reply(
            `O nome de sua empresa foi alterado com sucesso para: ${name}!`
          )
          await profileSchema.findOneAndUpdate(
            { userId: member.id },
            {
              $set: {
                'work.name': name,
              },
            }
          )
        }
        break
      }

      case 'trabalhar': {
        let cooldownindb = userData.work.cooldown
        let cooldown = 2.88e7
        let money = Math.ceil(
          userData.work.level * 2 * userData.work.coins + 200
        )
        let nextLevel = userData.work.nextLevel * userData.work.level
        let xp = Math.floor(Math.random() * 100) + 1

        if (
          cooldownindb !== null &&
          cooldown - (Date.now() - cooldownindb) > 0
        ) {
          interaction.reply(
            `Você deve esperar **${moment
              .duration(cooldown - (Date.now() - cooldownindb))
              .format('h [horas], m [minutos] e s [segundos]')
              .replace('minsutos', 'minutos')} para poder trabalhar novamente**`
          )
          return
        } else {
          interaction.reply(
            `Você trabalhou com sucesso e obteve **${money.toLocaleString()} renatocoins** e **${xp} de XP**`
          )

          const coins = money

          await profileSchema
            .findOneAndUpdate(
              { userId: member.id },
              {
                $set: {
                  coins: userData.coins + coins,
                  'work.cooldown': Date.now(),
                  'work.exp': userData.work.exp + xp,
                },
              }
            )
            .then(async (x) => {
              if (userData.work.level > nextLevel) {
                interaction.reply(
                  `Sua empresa upou de nível! Level atual: **${userData.work.level}**.`
                )
              }
            })

          break
        }
      }
    }
  },
}
