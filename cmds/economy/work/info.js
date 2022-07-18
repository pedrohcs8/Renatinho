const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')
const Utils = require('@util/Utils')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
require('moment-duration-format')

module.exports = class Info extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'info'
    this.category = 'Economy'
    this.description = 'Comando para ver as informações de sua empresa'
    this.usage = ''
    this.aliases = ['information']
    this.reference = 'work'

    this.enabled = true
    this.guildOnly = true
    this.isSub = true
  }

  async run({ message, args, prefix, author }) {
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
