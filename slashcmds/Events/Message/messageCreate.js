const { Message, EmbedBuilder, Client } = require('discord.js')
const db = require('../../../schemas/afk-schema')
const profileSchema = require('../../../schemas/profile-schema')

module.exports = {
  name: 'messageCreate',

  /**
   *
   * @param {Message} message
   * @param {Client} client
   */

  async execute(message, client) {
    const messages = message.content.toLowerCase()

    const channel = client.channels.cache.get(message.channel.id)

    if (messages === 'vai toma no cu') {
      channel.send('**Vai tu krl**')
    }

    if (messages === 'fodase') {
      channel.send('Fodase o karaleo.')
    }

    if (messages === 'vsfd') {
      channel.send('**Vai tu krl**')
    }

    if (messages === 'cala boca renato') {
      channel.send('**Cala tu**')
    }

    if (messages === 'cala boca') {
      channel.send('**Cala tu**')
    }
    if (messages === 'boa noite renatinho') {
      channel.send('Boa noite :)')
    }
    if (messages === 'bom dia renatinho') {
      channel.send('Bom dia :)')
    }
    if (messages === 'pao') {
      channel.send('Vini????????')
    }
    if (messages === 'pedro gay') {
      channel.send('Minha bola esquerda ele é totamente **H-E-T-E-R-O**!')
    }
    if (messages.toLocaleLowerCase() === 'macaquitos') {
      channel.send('Messi???!?!?!?!?!??!?!?!')
    }
    if (messages.toLocaleLowerCase() === 'craque neto') {
      channel.send('**Um monstro jogando bola**')
    }
    if (messages.toLocaleLowerCase() === 'maestro') {
      channel.send('**BOA TARRRRDE GENTI**')
    }

    try {
      const server = await this.client.database.guilds.findOne({
        idS: message.guild.id,
      })
      let user = await profileSchema.findOne({
        userId: message.author.id,
      })

      //Cria o documento se o Usuário não estiver cadastrado
      if (!user)
        await profileSchema.create({
          userId: message.author.id,
          name: message.author.tag,
        })

      //Cria o documento se o Servidor não estiver cadastrado
      if (!server)
        await this.client.database.guilds.create({
          idS: message.guild.id,
          name: message.guild.name,
        })

      // Sistema de XP
      if (!message.author.bot) {
        let xp = user.Exp.xp
        let level = user.Exp.level
        let nextLevel = user.Exp.nextLevel * level

        if (user.Exp.id == 'null') {
          await this.client.database.users.findOneAndUpdate(
            { userId: message.author.id },
            { $set: { 'Exp.id': message.author.id } }
          )
        }

        let xpGive = Math.floor(Math.random() * 5) + 1

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          {
            $set: {
              name: message.author.tag,
              'Exp.xp': xp + xpGive,
              'Exp.user': message.author.tag,
            },
          }
        )

        if (xp >= nextLevel) {
          await this.client.database.users.findOneAndUpdate(
            { userId: message.author.id },
            { $set: { 'Exp.xp': 0, 'Exp.level': level + 1 } }
          )

          message.reply(
            `${message.author}, você acaba de subir para o level **${
              level + 1
            }**.`
          )
          message.react('⬆️')
        }
      }
    } catch (err) {
      if (err) console.log(err)
    }
  },
}
