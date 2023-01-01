//Sistema de notificações do youtube

const Guild = require('@schemas/guild-schema')
const Command = require('@structures/Command')
const Youtube = new (require('simple-youtube-api'))(process.env.YOUTUBE_API)
const {
  MessageSelectMenu,
  MessageActionRow,
  MessageEmbed,
} = require('discord.js')
const parser = new (require('rss-parser'))()

module.exports = class youtubeNotificationsCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'youtubeNotifications'
    this.category = 'Config'
    this.description =
      'Comando para configurar as notificações dos canais do Youtube setados (Lives| Videos | etc)'
    this.usage = 'youtubeNotifications <url do canal>'
    this.aliases = ['ytnotifications', 'ytn']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const max_size = this.client.youtubeChannels.filter(
      (x) => x.guild === message.guild.id,
    )

    if (args[0] == 'list') {
      if (!max_size.length) {
        message.reply('Não há nenhum canal na lista de canais desse servidor')
        return
      }

      let row = new MessageActionRow()

      const menu = new MessageSelectMenu()
        .setCustomId('MenuSelection')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder('Selecione o Canal')

      let options = []
      let thumb = []

      for (let x of max_size) {
        thumb.push(
          await (
            await Youtube.getChannelByID(x.id)
          ).thumbnails.high.url,
        )

        const channel = await parser.parseURL(
          `https://www.youtube.com/feeds/videos.xml?channel_id=${x.id}`,
        )

        options.push({
          description: `Nome do Canal: **${channel.title}**\nCanal de Notificações: <#${x.textChannel}>\nMensagem Setada: **\`${x.msg}\`**`,
          label: channel.title,
          value: channel.title + 'aaa',
        })
      }

      options.forEach((option) => {
        menu.addOptions({ label: option.label, value: option.value })
      })

      const embed = new MessageEmbed().setDescription(
        `Lista dos Canis, use o seletor abaixo`,
      )

      row.addComponents(menu)

      const msg = await message.reply({ embeds: [embed], components: [row] })

      const filter = (interaction) => {
        return interaction.isSelectMenu() && interaction.message.id == msg.id
      }

      const collector = message.channel.createMessageCollector({
        time: 30000,
        filter: filter,
      })

      return
    }

    if (!message.member.permissions.has('ADMINISTRATOR' && 'MANAGE_GUILD')) {
      message.reply('Você não tem permissão para usar esse comando.')
      return
    }

    if (max_size.length > 3) {
      message.reply('O máximo de canais por servidor é 3.')
      return
    }

    const url = args[0]

    if (!url) {
      message.reply('Você não digitou o url do canal.')
      return
    }

    const verify = await Youtube.getChannel(url).catch(() => {})

    if (!verify) {
      message.reply(
        'O canal não foi encontrado, tente novamente (Não aceito URLs personalizadas!)',
      )
      return
    }

    const verifyArray = this.client.youtubeChannels
      .filter((x) => x.guild === message.guild.id)
      .find((x) => x.id === verify.id)

    if (verifyArray) {
      message.reply('O canal inserido já está na lista!')
      return
    }

    if (!args[1]) {
      message.reply(
        'Você não inseriu o canal onde as notificações serão mandadas!',
      )
      return
    }

    const textChannel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[1])

    if (!textChannel || textChannel.type != 'GUILD_TEXT') {
      message.reply('O canal inserido não é um canal de texto ou inválido')
      return
    }

    const msg = await message.reply(
      'Qual mensagem você deseja que seja mandada quando um vídeo novo for postado?',
    )

    const filter = (m) => m.author.id === message.author.id
    let collector = msg.channel
      .createMessageCollector({ filter: filter, max: 1, time: 60000 * 2 })

      .on('collect', async (collected) => {
        if (['cancelar', 'cancel'].includes(collected.content.toLowerCase())) {
          message.reply('Operação cancelada com sucesso.')

          msg.delete()
          return collector.stop()
        }

        await Guild.findOneAndUpdate(
          { idS: message.guild.id },
          {
            push: {
              youtube: [
                {
                  id: verify.id,
                  textChannel: textChannel.id,
                  guild: message.guild.id,
                  msg: collected.content,
                },
              ],
            },
          },
        )

        this.client.youtubeChannels.push({
          id: verify.id,
          textChannel: textChannel.id,
          guild: message.guild.id,
          msg: collected.content,
        })

        message.reply('Sistema configurado com sucesso!')

        msg.delete()
        return collector.stop()
      })
  }
}
