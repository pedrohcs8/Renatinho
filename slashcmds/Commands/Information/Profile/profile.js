const { loadImage, createCanvas } = require('canvas')
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
} = require('discord.js')
const { Util } = require('../../../../util')
const Emojis = require('../../../../util/Emojis')
const profileSchema = require('../../../../schemas/profile-schema')
const economy = require('@features/economy')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Comando para mostrar seu perfil'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    await interaction.deferReply()

    const { guild, member } = interaction

    const guildId = guild.id

    const results = await profileSchema.findOne({ userId: member.id })

    const xp = results.Exp.xp
    const level = results.Exp.level

    const getNeededXP = (level) => level * level * 100

    const needed = getNeededXP(level)

    const User = interaction.user

    const doc = await profileSchema.findOne({ userId: User.id })

    const bg = doc.backgrounds.active || 0

    const coins = doc.coins + doc.bank

    if (bg === 4) {
      const canvas = createCanvas(800, 600)
      const ctx = canvas.getContext('2d')

      //=========================// Import Background //=========================//

      let back_img = doc.custombackground.path

      const background_img = await loadImage(back_img)
      ctx.drawImage(background_img, 0, 0, 800, 600)

      //Texts ==========================================================>//

      const fontColor = doc.custombackground.fontColor

      //Username
      ctx.textAlign = 'left'
      ctx.font = '50px "Segoe UI Black"'
      ctx.fillStyle = fontColor
      await Util.renderEmoji(ctx, this.shorten(User.username, 20), 200, 100)

      //Badges

      let list = []

      const flags = User.flags === 'null' ? '' : User.flags.toArray()
      list.push(flags)

      if (doc.marry.has) {
        list.push('CASADO')
      }

      if (interaction.guild.ownerId === User.id) {
        list.push('SERVER_OWNER')
      }

      if (User.id === '227559154007408641') {
        list.push('DONO')
      }

      list = list
        .join('')
        .replace('EARLY_VERIFIED_DEVELOPER', Emojis.Verified_Developer)
        .replace('HypeSquadOnlineHouse1', Emojis.Bravery)
        .replace('HypeSquadOnlineHouse2', Emojis.Brilliance)
        .replace('HypeSquadOnlineHouse3', Emojis.Balance)
        .replace('VERIFIED_BOT', Emojis.Verified_Bot)
        .replace('VERIFIED_DEVELOPER', Emojis.Verified_Developer)
        .replace('ActiveDeveloper', Emojis.ActiveDeveloper)
        .replace('CASADO', Emojis.Alianca)
        .replace('DONO', '🔰')
        .replace('SERVER_OWNER', Emojis.Server_Owner)

      ctx.font = '30px "Segoe Print"'
      await Util.renderEmoji(ctx, list.split(',').join(''), 200, 150)

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

      if (doc.marry.has) {
        ctx.fillStyle = fontColor
        ctx.fillText(`Casado com o(a)`, 300, 500)
        ctx.fillText(
          await this.client.users.fetch(doc.marry.user).then((x) => x.tag),
          300,
          540
        )
      }

      //Sobre
      ctx.font = '20px "Montserrat Black"'
      ctx.fillStyle = fontColor
      ctx.fillText(
        doc.about == 'null'
          ? `Use o comando sobremim para alterar essa mensagem`
          : doc.about.match(/.{1,60}/g).join('\n'),
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

      const avatar = await loadImage(
        User.displayAvatarURL({ extension: 'jpg' })
      )
      ctx.drawImage(avatar, 15, 12, 170, 170)

      //=========================// //=========================//

      const attach = new AttachmentBuilder(
        canvas.toBuffer(),
        `Profile_${User.tag}_.png`
      )

      interaction.editReply({
        files: [attach],
      })
      return
    } else {
      //Background Presetados

      const canvas = createCanvas(900, 600)
      const ctx = canvas.getContext('2d')

      //========================// Import Avatar //========================//

      const avatar = await loadImage(
        interaction.user.displayAvatarURL({ extension: 'jpg', size: 2048 })
      )
      ctx.drawImage(avatar, 20, 68, 200, 215)
      //    ctx.drawImage(avatar, //x pos, //y pos, //x im, //y im)

      //========================// Import Background //========================//
      const backgrounds = {
        one: {
          id: 1,
          price: 5000,
          background:
            './src/assets/img/png/Background_renato_Vaporwave_bonito.png',
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
        back_img = './src/assets/img/png/backup_nova.png'
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

      if (doc.marry.has) {
        list.push('CASADO')
      }

      if (interaction.guild.ownerId === User.id) {
        list.push('SERVER_OWNER')
      }

      if (User.id === '227559154007408641') {
        list.push('DONO')
      }

      list = list
        .join('')
        .replace('EARLY_VERIFIED_DEVELOPER', Emojis.Verified_Developer)
        .replace('HypeSquadOnlineHouse1', Emojis.Bravery)
        .replace('HypeSquadOnlineHouse2', Emojis.Brilliance)
        .replace('HypeSquadOnlineHouse3', Emojis.Balance)
        .replace('VERIFIED_BOT', Emojis.Verified_Bot)
        .replace('VERIFIED_DEVELOPER', Emojis.Verified_Developer)
        .replace('CASADO', Emojis.Alianca)
        .replace('DONO', '🔰') //Dono do Bot
        .replace('ActiveDeveloper', Emojis.ActiveDeveloper)
        .replace('SERVER_OWNER', Emojis.Server_Owner)

      ctx.font = '30px "Segoe Print"'
      await Util.renderEmoji(ctx, list.split(',').join(''), 230, 240)

      // Titles
      ctx.textAlign = 'left'
      ctx.font = '30px "Segoe UI Black"'
      ctx.fillStyle = 'rgb(253, 255, 252)'
      ctx.fillText('Coins:', 10, 500)
      ctx.fillText(`XP:`, 10, 570)

      //Coins/XP
      ctx.textAlign = 'left'
      ctx.font = ' 30px "Segoe UI"'
      ctx.fillStyle = 'rgb(253, 255, 252)'
      ctx.fillText(`${coins === undefined ? '0' : coins}`, 100, 500)
      ctx.fillText(`#${level} | ${xp}/${needed}`, 60, 570)

      if (doc.marry.has) {
        ctx.fillText(`Casado com o(a)`, 300, 500)
        ctx.fillText(
          await this.client.users.fetch(doc.marry.user).then((x) => x.tag),
          300,
          540
        )
      }

      //Sobre

      ctx.font = '20px "Montserrat Black"'
      ctx.fillText(
        doc.about == 'null'
          ? `Use o comando sobremim <msg> para alterar essa mensagem`
          : doc.about.match(/.{1,60}/g).join('\n'),
        65,
        333
      )

      //========================// Create Image //========================//

      const attach = new AttachmentBuilder(
        canvas.toBuffer(),
        `Profile_${User.tag}_.png`
      )

      interaction.editReply({
        files: [attach],
      })
    }
  },
  shorten(text, len) {
    if (typeof text !== 'string') return ''
    if (text.length <= len) return text
    return text.substr(0, len).trim() + '...'
  },
}
