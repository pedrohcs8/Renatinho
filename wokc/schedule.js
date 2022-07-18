const momentTimezone = require('moment-timezone')
const { MessageCollector } = require('discord.js')

const scheduledSchema = require('@schemas/scheduled-schema')

module.exports = {
  requiredPermissions: ['ADMINISTRATOR'],
  expectedArgs: '<# do canal> <YYYY/MM/DD> <HH:MM> <"AM" ou "PM"> <Timezone>',
  minArgs: 5,
  maxArgs: 5,
  init: (client) => {
    const checkForPosts = async () => {
      const query = {
        date: {
          $lte: Date.now(),
        },
      }

      const results = await scheduledSchema.find(query)

      for (const post of results) {
        const { guildId, channelId, content } = post

        const guild = await client.guilds.fetch(guildId)
        if (!guild) {
          continue
        }

        const channel = guild.channels.cache.get(channelId)
        if (!channel) {
          continue
        }

        channel.send(content)
      }

      await scheduledSchema.deleteMany(query)

      setTimeout(checkForPosts, 1000 * 10)
    }

    checkForPosts()
  },
  callback: async ({ message, args }) => {
    const { mentions, guild, channel } = message

    const targetChannel = mentions.channels.first()
    if (!targetChannel) {
      message.reply('Por favor marque um canal.')
      return
    }

    // Remve the channel tag from the args array
    args.shift()
    console.log(args)

    const [date, time, clockType, timeZone] = args

    if (clockType !== 'AM' && clockType !== 'PM') {
      message.reply(
        `Você deve prover "AM" or "PM", você proveu "${clockType}"`
      )
      return
    }

    const validTimeZones = momentTimezone.tz.names()
    if (!validTimeZones.includes(timeZone)) {
      message.reply(
        'Timezone desconhecida! Por favor use uma das seguintes: <https://gist.github.com/AlexzanderFlores/d511a7c7e97b4c3ae60cb6e562f78300>'
      )
      return
    }

    const targetDate = momentTimezone.tz(
      `${date} ${time} ${clockType}`,
      'YYYY-MM-DD HH:mm A',
      timeZone
    )

    message.reply('Mande a menssagem que gostaria de agendar.')

    const filter = (newMessage) => {
      return newMessage.author.id === message.author.id
    }

    const collector = new MessageCollector(channel, filter, {
      max: 1,
      time: 1000 * 60, // 60 seconds
    })

    collector.on('end', async (collected) => {
      const collectedMessage = collected.first()

      if (!collectedMessage) {
        message.reply('Você não respondeu a tempo.')
        return
      }

      message.reply('Sua menssagem foi agendada.')

      await new scheduledSchema({
        date: targetDate.valueOf(),
        content: collectedMessage.content,
        guildId: guild.id,
        channelId: targetChannel.id,
      }).save()
    })
  },
}