const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`)
const ClientEmbed = require('@structures/ClientEmbed')
const { WebhookClient } = require('discord.js')
const moment = require('moment')
const coldoown = new Set()
const c = require('colors')
const profileSchema = require('../../schemas/profile-schema')
const prefix = '.'
let t

module.exports = class messageCreate {
  constructor(client) {
    this.client = client
  }

  async run(message) {
    moment.locale('pt-BR')

    try {
      const server = await this.client.database.guilds.findOne({
        idS: message.guild.id,
      })
      let user = await profileSchema.findOne({
        userId: message.author.id,
      })

      if (!user)
        await profileSchema.create({
          userId: message.author.id,
          name: message.author.tag,
        })

      if (!server)
        await this.client.database.guilds.create({ idS: message.guild.id, name: message.guild.name })

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

      const client = await this.client.database.clientUtils.findOne({
        _id: this.client.user.id,
      })
      if (!client)
        await this.client.database.clientUtils.create({
          _id: this.client.user.id,
          reason: '',
          manutenção: false,
        })

      if (message.content.indexOf(prefix) !== 0) return
      const author = message.author
      const args = message.content.slice(prefix.length).trim().split(/ +/g)
      const command = args.shift().toLowerCase()
      const cmd =
        this.client.commands.get(command) ||
        this.client.commands.get(this.client.aliases.get(command))

      if (!cmd) return

      const comando = await this.client.database.commands.findOne({
        _id: cmd.name,
      })

      if (comando) {
        const cb = server.cmdblock

        if (cb.status) {
          if (!cb.cmds.some((x) => x === cmd.name)) {
            if (!cb.channels.some((x) => x === message.channel.id)) {
              if (!message.member.permissions.has('MANAGE_MESSAGES')) {
                return message.reply(cb.msg)
              }
            }
          }
        }

        cmd.run({ message, args, prefix, author })
        var num = comando.usages
        num = num + 1

        // Webhook de Comandos Usados //

        /* const Webhook = new WebhookClient(
          "844034198792175646",
          "5ltRKYvh2uJeCqKYZxMxQ8IV0eKsrUudCtTkzywdsnAyFerqYxfdaIKIbYWcK26afGIF"
        );

        const EMBED_COMMANDS = new ClientEmbed(this.client.user)
          .setAuthor(
            `Logs de Comandos do Bot`,
            this.client.user.displayAvatarURL()
          )
          .addFields(
            {
              name: `Servidor que foi Usado`,
              value: `**${message.guild.name}** \`( ${message.guild.id} )\``,
            },
            {
              name: `Author do Comando`,
              value: `**${message.author.tag}** \`( ${message.author.id} )\``,
            },
            {
              name: `Data da Execução`,
              value: moment(Date.now()).format("L LT"),
            },
            {
              name: `O que foi executado`,
              value: `**\`${cmd.name} ${args.join(" ")}\`**`,
            }
          )
          .setTimestamp()
          .setFooter(
            message.author.id,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setThumbnail(
            this.client.user.displayAvatarURL({ format: "jpg", size: 2048 })
          );

        Webhook.send(EMBED_COMMANDS); */

        // ========================== //

        if (!['600804786492932101'].includes(message.author.id)) {
          coldoown.add(message.author.id)
          setTimeout(() => {
            coldoown.delete(message.author.id)
          }, 5000)
        }
        await this.client.database.commands.findOneAndUpdate(
          { _id: cmd.name },
          { $set: { usages: num } }
        )
      } else {
        await this.client.database.commands.create({
          _id: cmd.name,
          usages: 1,
          manutenção: false,
        })

        console.log(
          c.cyan(
            `[Novo Comando] - O comando: ( ${cmd.name} ) teve o seu Documento criado com Sucesso!`
          )
        )
        message.channel.send('Documento do comando criado, mande novamente.')
      }
    } catch (err) {
      if (err) console.error(err)
    }
  }
}
