const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const { MessageEmbed } = require('discord.js')
const canvacord = require('canvacord')
const img = 'https://cdn.discordapp.com/embed/avatars/0.png'
const Discord = require('discord.js')

module.exports = class XPCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'xp'
    this.category = 'Economy'
    this.description = 'Comando ver seu XP'
    this.usage = 'xp'
    this.aliases = ['xp']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    let USER =
      message.mentions.users.first() ||
      this.client.users.cache.get(args[0]) ||
      message.author

    profileSchema.findOne({ userId: USER.id }, async (err, user) => {
      await require('mongoose')
        .connection.collection('profiles')
        .find({ 'Exp.xp': { $gt: 5 } })
        .toArray((err, res) => {
          if (err) throw err
          let Exp = res.map((x) => x.Exp).sort((x, f) => f.level - x.level)

          let ranking =
            [...Exp.values()].findIndex((x) => x.id === message.author.id) + 1

          let xp = user.Exp.xp
          let level = user.Exp.level
          let nextLevel = user.Exp.nextLevel * level

          const rank = new canvacord.Rank()
            .setAvatar(message.author.displayAvatarURL({ format: 'jpg' }))
            .setCurrentXP(xp)
            .setRequiredXP(nextLevel)
            .setRank(ranking, 'Rank', true)
            .setLevel(level)
            .setProgressBar(process.env.EMBED_COLOR, 'COLOR')
            .setUsername(message.author.username)
            .setDiscriminator(message.author.discriminator)

          rank.build().then((data) => {
            const attachment = new Discord.MessageAttachment(
              data,
              `${USER.tag}--XP.png`
            )
            message.reply({ files: [attachment] })
          })
        })
    })
  }
}
