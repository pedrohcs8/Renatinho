const Command = require('@util/structures/Command')
const { loadImage, registerFont, createCanvas } = require('canvas')
const profileSchema = require('@schemas/profile-schema')
const { MessageAttachment } = require('discord.js')
const economy = require('@features/economy')
const Util = require('@util/Utils')
const Emojis = require('@util/Emojis')
const fs = require('fs')
const path = require('path')

registerFont('src/assets/fonts/Montserrat-Black.ttf', { family: 'Montserrat' })
registerFont('src/assets/fonts/Segoe-Print.ttf', { family: 'Segoe Print' })
registerFont('src/assets/fonts/Segoe-UI.ttf', { family: 'Segoe UI' })
registerFont('src/assets/fonts/Segoe-UI-Black.ttf', {
  family: 'Segoe UI Black',
})

const NodeCouchDB = require('node-couchdb')
const couch = new NodeCouchDB({
  auth: {
    user: 'admin',
    password: 'admin',
  },
  host: '192.168.0.119',
  protocol: 'http',
  port: 5984,
})

const dbName = 'renatinho-photos'
const viewUrl = '_design/all_images/_view/all'

module.exports = class ProfileCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'profile'
    this.category = 'Info'
    this.description = 'Comando para mostrar seu perfil'
    this.usage = 'profile [@ da pessoa]'
    this.aliases = ['profile', 'p']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const target = message.mentions.users.first() || message.author

    if (target.id === '795418788655792129') {
      message.reply(
        'Eu não tenho dados suficientes de mim mesmo para mostrar, sorry :('
      )
      message.reply('Mas você pode usar .botprofile')
      return
    }

    const guildId = message.guild.id
    const userId = target.id

    const results = await profileSchema.findOne({ userId })

    const xp = results.Exp.xp
    const level = results.Exp.level

    const getNeededXP = (level) => level * level * 100

    const coins = await economy.getCoins(guildId, userId)

    const needed = getNeededXP(level)

    const User =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      message.author

    const user = await profileSchema.findOne({ userId: User.id })

    const doc = await profileSchema.findOne({ userId })

    const bg = doc.backgrounds.active

    if (bg === 4) {
      const canvas = createCanvas(800, 600)
      const ctx = canvas.getContext('2d')

      //=========================// Import Background //=========================//

      const result = await couch.get(dbName, viewUrl)

      const filename = await result.data

      const index = filename.rows.filter((x) => x.value.userId == `${userId}`)

      const background = await loadImage(`./images/${index[0].value.filename}`)

      const fontColor = index[0].value.color

      ctx.drawImage(background, 0, 0, 800, 600)

      //Texts ==========================================================>//

      //Username
      ctx.textAlign = 'left'
      ctx.font = ' 50px "Segoe UI Black"'
      ctx.fillStyle = fontColor
      await Util.renderEmoji(ctx, this.shorten(User.username, 20), 200, 100)

      //Badges

      let list = []

      const flags = User.flags === 'null' ? '' : User.flags.toArray()
      list.push(flags)

      if (user.marry.has) {
        list.push('CASADO')
      }

      if (message.guild.ownerId === User.id) {
        list.push('SERVER_OWNER')
      }

      if (User.id === '227559154007408641') {
        list.push('DONO')
      }

      list = list
        .join('')
        .replace('EARLY_VERIFIED_DEVELOPER', Emojis.Verified_Developer)
        .replace('HOUSE_BRAVERY', Emojis.Bravery)
        .replace('HOUSE_BRILLIANCE', Emojis.Brilliance)
        .replace('HOUSE_BALANCE', Emojis.Balance)
        .replace('VERIFIED_BOT', Emojis.Verified_Bot)
        .replace('VERIFIED_DEVELOPER', Emojis.Verified_Developer)
        .replace('CASADO', Emojis.Alianca)
        .replace('DONO', '🔰')
        .replace('SERVER_OWNER', Emojis.Server_Owner)

      ctx.font = '30px "Segoe Print"'
      await Util.renderEmoji(ctx, list.split(', ').join(''), 200, 150)

      // Titles
      ctx.textAlign = 'left'
      ctx.font = ' 30px "Segoe UI Black"'
      ctx.fillStyle = fontColor
      ctx.fillText('Coins:', 10, 500)
      ctx.fillText(`XP:`, 10, 570)

      //Coins/XP
      ctx.textAlign = 'left'
      ctx.font = ' 30px "Segoe UI"'
      ctx.fillStyle = fontColor
      ctx.fillText(`${coins === undefined ? '0' : coins}`, 100, 500)
      ctx.fillText(`#${level} | ${xp}/${needed}`, 60, 570)

      if (user.marry.has) {
        ctx.fillStyle = fontColor
        ctx.fillText(`Casado com o(a)`, 300, 500)
        ctx.fillText(
          await this.client.users.fetch(user.marry.user).then((x) => x.tag),
          300,
          540
        )
      }

      //Sobre

      ctx.font = '20px "Montserrat Black"'
      ctx.fillStyle = fontColor
      ctx.fillText(
        user.about == 'null'
          ? `Use ${prefix}sobremim <msg> para alterar essa mensagem`
          : user.about.match(/.{1,60}/g).join('\n'),
        10,
        333
      )

      //=========================// Import Avatar //=========================//

      ctx.arc(100, 95, 85, 0, Math.PI * 2, true)
      ctx.lineWidth = 6
      ctx.strokeStyle = fontColor
      ctx.stroke()
      ctx.closePath()
      ctx.clip()

      const avatar = await loadImage(User.displayAvatarURL({ format: 'jpeg' }))
      ctx.drawImage(avatar, 15, 12, 170, 170)

      //=========================// //=========================//

      const attach = new MessageAttachment(
        canvas.toBuffer(),
        `Profile_${User.tag}_.png`
      )

      message.reply({ files: [attach] })
      return
    } else {
      const canvas = createCanvas(900, 600)
      const ctx = canvas.getContext('2d')

      //========================// Import Avatar //========================//

      const avatar = await loadImage(
        User.displayAvatarURL({ format: 'jpeg', size: 2048 })
      )
      ctx.drawImage(avatar, 20, 68, 200, 215)
      //    ctx.drawImage(avatar, //x pos, //y pos, //x im, //y im)

      //========================// Import Background //========================//
      const backgrounds = {
        one: {
          id: 1,
          price: 5000,
          background:
            './src/assets/img/png/Background_renato_Vaporwave bonito.png',
        },
        two: {
          id: 2,
          price: 10000,
          background:
            './src/assets/img/png/Background_renato_Vaporwave_Bonitauz.png',
        },
        three: {
          id: 3,
          price: 12000,
          background: './src/assets/img/png/Background_centauri.png',
        },
      }

      let back_img = ''

      if (bg === 0) {
        back_img = './src/assets/img/png/backup nova.png'
      } else {
        back_img = Object.entries(backgrounds).find(([, x]) => x.id === bg)[1]
          .background
      }

      const back = await loadImage(back_img)
      ctx.drawImage(back, 0, 0, 900, 600)

      //Texts ==========================================================>//

      //Username
      ctx.textAlign = 'left'
      ctx.font = ' 50px "Segoe UI Black"'
      ctx.fillStyle = 'rgb(253, 255, 252)'
      await Util.renderEmoji(ctx, this.shorten(User.username, 20), 230, 190)

      //Badges

      let list = []

      const flags = User.flags === 'null' ? '' : User.flags.toArray()
      list.push(flags)

      if (user.marry.has) {
        list.push('CASADO')
      }

      if (message.guild.ownerId === User.id) {
        list.push('SERVER_OWNER')
      }

      if (User.id === '227559154007408641') {
        list.push('DONO')
      }

      list = list
        .join('')
        .replace('EARLY_VERIFIED_DEVELOPER', Emojis.Verified_Developer)
        .replace('HOUSE_BRAVERY', Emojis.Bravery)
        .replace('HOUSE_BRILLIANCE', Emojis.Brilliance)
        .replace('HOUSE_BALANCE', Emojis.Balance)
        .replace('VERIFIED_BOT', Emojis.Verified_Bot)
        .replace('VERIFIED_DEVELOPER', Emojis.Verified_Developer)
        .replace('CASADO', Emojis.Alianca)
        .replace('DONO', '🔰')
        .replace('SERVER_OWNER', Emojis.Server_Owner)

      ctx.font = '30px "Segoe Print"'
      await Util.renderEmoji(ctx, list.split(', ').join(''), 230, 240)

      // Titles
      ctx.textAlign = 'left'
      ctx.font = ' 30px "Segoe UI Black"'
      ctx.fillStyle = 'rgb(253, 255, 252)'
      ctx.fillText('Coins:', 10, 500)
      ctx.fillText(`XP:`, 10, 570)

      //Coins/XP
      ctx.textAlign = 'left'
      ctx.font = ' 30px "Segoe UI"'
      ctx.fillStyle = 'rgb(253, 255, 252)'
      ctx.fillText(`${coins === undefined ? '0' : coins}`, 100, 500)
      ctx.fillText(`#${level} | ${xp}/${needed}`, 60, 570)

      if (user.marry.has) {
        ctx.fillText(`Casado com o(a)`, 300, 500)
        ctx.fillText(
          await this.client.users.fetch(user.marry.user).then((x) => x.tag),
          300,
          540
        )
      }

      //Sobre

      ctx.font = '20px "Montserrat Black"'
      ctx.fillText(
        user.about == 'null'
          ? `Use ${prefix}sobremim <msg> para alterar essa mensagem`
          : user.about.match(/.{1,60}/g).join('\n'),
        65,
        333
      )

      //========================// Create Image //========================//

      const attach = new MessageAttachment(
        canvas.toBuffer(),
        `Profile_${User.tag}_.png`
      )

      message.reply({ files: [attach] })
    }
  }
  shorten(text, len) {
    if (typeof text !== 'string') return ''
    if (text.length <= len) return text
    return text.substr(0, len).trim() + '...'
  }
}
