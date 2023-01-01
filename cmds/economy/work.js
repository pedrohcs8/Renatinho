const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')
const Utils = require('@util/Utils')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
require('moment-duration-format')

module.exports = class WorkCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'work'
    this.category = 'Economy'
    this.description = 'Comando para trabalhar'
    this.usage = 'work info'
    this.aliases = ['trabalhar', 'trampar']
    this.subcommands = ['info', 'name']
    this.reference = 'work'

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const user = await profileSchema.findOne({userId: message.author.id})

    const subs =
      args[0] &&
      this.client.subcommands
        .get(this.reference)
        .find(
          (cmd) =>
            cmd.name.toLowerCase() === args[0].toLowerCase() ||
            cmd.aliases.includes(args[0].toLowerCase())
        )

    let subcmd
    let sub

    if (!subs) {
      sub = 'null'
      this.client.subcommands
        .get(this.reference)
        .find(
          (cmd) =>
            cmd.name.toLowerCase() === sub.toLowerCase() ||
            cmd.aliases.includes(sub.toLowerCase())
        )
    } else subcmd = subs

    if (subcmd != undefined)
      return subcmd.run({ message, args, prefix, author })

    let xp = Math.floor(Math.random() * 100) + 1

    if (!args[0]) {
      profileSchema.findOne(
        { userId: message.author.id },
        async (err, user) => {
          let work = user.work.cooldown
          let cooldown = 2.88e7
          let money = Math.ceil(user.work.level * 2 * user.work.coins + 200)
          let nextLevel = user.work.nextLevel * user.work.level

          if (work !== null && cooldown - (Date.now() - work) > 0) {
            message.reply(
              `Você deve esperar **${moment
                .duration(cooldown - (Date.now() - work))
                .format('h [horas], m [minutos] e s [segundos]')
                .replace(
                  'minsutos',
                  'minutos'
                )} para poder trabalhar novamente**`
            )
            return
          } else {
            message.reply(
              `Você trabalhou com sucesso e obteve **${money.toLocaleString()} renatocoins** e **${xp} de XP**`
            )

            const { guild, member } = message
            const { id } = member

            const guildId = guild.id
            const userId = id

            const coins = money

   
            await profileSchema
            .findOneAndUpdate(
              { userId: message.author.id },
              {
                $set: {
                  coins: user.coins + coins
                },
              }
            )
            await profileSchema
              .findOneAndUpdate(
                { userId: message.author.id },
                {
                  $set: {
                    'work.cooldown': Date.now(),
                    'work.exp': user.work.exp + xp,
                  },
                }
              )
              .then(async (x) => {
                if (user.work.level > nextLevel) {
                  message.reply(
                    `Sua empresa upou de nível! Level atual: **${user.work.level}**.`
                  )
                }
              })
          }
        }
      )
      return
    }

    if (['name', 'nome'].includes(args[0].toLowerCase())) {
      profileSchema.findOne(
        { userId: message.author.id },
        async (err, user) => {
          const work = user.work
          let name = args.slice(1).join(' ')

          if (!name) {
            return message.reply(
              'Você deve mandar o nome á ser setado em sua empresa.'
            )
          } else if (name === work.name) {
            return message.reply('O nome inserido é igual ao atual')
          } else if (name.length > 25) {
            return message.reply(
              'O nome inserido é muito grande, tente novamente com 25 ou menos caracteres.'
            )
          } else {
            message.reply(
              `O nome de sua empresa foi alterado com sucesso para: ${name}!`
            )
            await profileSchema.findOneAndUpdate(
              { userId: message.author.id },
              {
                $set: {
                  'work.name': name,
                },
              }
            )
          }
        }
      )
      return
    }

    if (['info', 'information'].includes(args[0].toLowerCase())) {
      const User =
        this.client.users.cache.get(args[1]) ||
        message.mentions.members.first() ||
        message.author

      profileSchema.findOne({ userId: User.id }, async (err, user) => {
        const work = user.work
        let money = Math.ceil(work.level * 2 * work.coins + 200)
        let cooldown = 2.88e7
        let cool = work.cooldown

        const embed = new MessageEmbed()
          .setAuthor(`Empresa de ${User.username}`)
          .setThumbnail(
            User.displayAvatarURL({
              dynamic: true,
              size: 2048,
              format: 'jpeg',
            })
          )
          .setColor('#FB0202')
          .addFields(
            {
              name: 'Nome da Empresa',
              value:
                user.work.name == 'null' ? 'Nome não definido' : user.work.name,
            },
            {
              name: 'Level/XP',
              value: `#${user.work.level} - ${work.exp}/${
                work.level * work.nextLevel
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

        message.reply({ embeds: [embed] })
      })
    }
  }
}
