const { MessageEmbed } = require('discord.js')
const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const moment = require('moment')
require('moment-duration-format')

module.exports = class RepsCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'reps'
    this.category = 'Info'
    this.description = 'Comando para ver sua reputação'
    this.usage = 'reps [@ da pessoa]'
    this.aliases = ['reps', 'reputação']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const USER =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      message.author

    const doc = await this.client.database.users.findOne({ userId: USER.id })
    const rep = doc.reps
    const cooldown = 7.2e6 - (Date.now() - rep.time)

    const lastReceived =
      rep.lastRep == 'null' ? '' : await this.client.users.fetch(rep.lastRep)
    const lastSend =
      rep.lastSend == 'null' ? '' : await this.client.users.fetch(rep.lastSend)

    const embed = new MessageEmbed()
      .setTitle('Informações sobre sua reputação')
      .setColor('#01DF01')
      .addFields(
        {
          name: 'Sua reputação',
          value: rep.size == 0 ? 'Nenhuma' : rep.size,
        },
        {
          name: 'Última pessoa que te avaliou',
          value: rep.lastRep == 'null' ? 'Ninguém' : lastReceived.tag,
        },
        {
          name: 'Última pessoa que você avaliou',
          value: rep.lastSend == 'null' ? 'Ninguém' : lastSend.tag,
        },
        {
          name: 'Cooldown',
          value:
            cooldown < 0
              ? 'Pode avaliar novamente'
              : moment
                  .duration(cooldown)
                  .format('h [horas] m [minutos] e s [segundos]')
                  .replace('minsutos', 'minutos'),
        },
      )

    message.reply({ embeds: [embed] })
  }
}
