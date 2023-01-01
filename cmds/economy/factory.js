//Sistema de Fábrica

const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')
const economy = require('@features/economy')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
require('moment-duration-format')

module.exports = class FactoryCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'factory'
    this.category = 'Economy'
    this.description = 'Comando de sistema de fábrica do bot'
    this.usage = 'factory'
    this.aliases = ['fábrica', 'fb']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const User =
      this.client.users.cache.get(args[1]) ||
      message.mentions.members.first() ||
      message.author

    const user = await profileSchema.findOne({ userId: User.id })
    const fb = user?.factory

    if (!args[0]) {
      const embed = new MessageEmbed()
        .setTitle('Sistema de Fábrica - Help')
        .setDescription(
          '> **fb create** - Cria uma fábrica\n> **fb info** - Olha as informações de sua Fábrica\n> **fb invite** - Convida alguém para sua Fábrica\n> **fb demitir** - Demite alguém de sua fábrica/pedido de demissão\n> **fb name** muda o nome de sua Fábrica'
        )
      message.reply({ embeds: [embed] })
      return
    }

    if (['info'].includes(args[0].toLowerCase())) {
      if (!fb.hasFactory) {
        message.reply(
          `${
            User.id == message.author
              ? 'Você não faz parte de nenhuma Fábrica'
              : `O(a) ${User} não faz parte de nenhuma Fábrica`
          }!`
        )
        return
      }

      const owner = await this.client.users.fetch(fb.owner)
      const fd = await this.client.database.users
        .findOne({ userId: owner.id })
        .then((x) => x.factory)

      const members = []
      const list = fd.employers

      await this.PUSH(members, list)

      const embed = new MessageEmbed()
        .setTitle(`Informações da Fábrica`)
        .addFields(
          {
            name: `Dono da Fábrica`,
            value: `${owner.tag} ( ${
              2.88e7 - (Date.now() - fd.lastWork) < 0
                ? '**Pode Trabalhar**'
                : `\`${moment
                    .duration(2.88e7 - (Date.now() - fd.lastWork))
                    .format('h[h] m[m] s[s]')}\``
            } )`,
          },
          {
            name: 'Nome da Fábrica',
            value: fd.name == 'null' ? 'Nome não Definido' : fd.name,
          },
          {
            name: `Level`,
            value: `${fd.level} - XP: ${fd.exp}/${fd.level * fd.nextLevel}`,
          },
          {
            name: `Funcionários`,
            value: !fd.employers.length
              ? 'Nenhum Funcionário no Momento'
              : `${members
                  .map(
                    (x) =>
                      `**\`${x.user.tag}\`** ( ${
                        2.88e7 - (Date.now() - x.lastWork) < 0
                          ? '**Pode Trabalhar**'
                          : `\`${moment
                              .duration(2.88e7 - (Date.now() - x.lastWork))
                              .format('h[h] m[m] s[s]')}\``
                      } )`
                  )
                  .join('\n')}`,
          }
        )

      return message.reply({ embeds: [embed] })
    }

    const { guild, member } = message
    const { id } = member

    const guildId = guild.id
    const userId = id

    if (['work', 'trabalhar', 'trampar'].includes(args[0].toLowerCase())) {
      if (!fb.hasFactory) {
        message.reply('Você não está em uma fábrica')
      }

      const owner = await this.client.users.fetch(fb.owner)

      const user = await profileSchema.findOne({ userId: message.author.id })
      const fd = user?.factory
      let cooldown = 2.88e7 - (Date.now() - fd.lastWork)

      console.log(cooldown)

      let XP = this.generateRandomNumber(10, 500)
      let COINS = this.generateRandomNumber(1000, 10000)
      COINS = COINS * fb.level

      if (cooldown > 0) {
        message.reply(
          `Você deve esperar **${moment
            .duration(cooldown)
            .format('h [horas] m [minutos] s [segundos]')
            .replace('minsutos', 'minutos')}** para trabalhar novamente.`
        )
        return
      } else {
        message.reply(
          `Você trabalhou com sucesso e conseguiu **${XP}** de xp para a Fábrica e **RC${COINS}** que foram depositados em seu banco`
        )

        const fc = await profileSchema
          .findOne({ userId: owner.id })
          .then((x) => x.factory)
        await profileSchema.findOneAndUpdate(
          { userId: owner.id },
          { $set: { 'factory.exp': fc.exp + XP } }
        )
        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          { $set: { 'factory.lastWork': Date.now() } }
        )
        await economy.addCoins(guildId, userId, COINS)
      }
    }

    if (['demitir', 'kickar', 'expulsar'].includes(args[0].toLowerCase())) {
      if (!fb.hasFactory) {
        message.reply('Você/o membro não faz parte de nenhuma fábrica')
      }

      const owner = await this.client.users.fetch(fb.owner)
      const fd = await profileSchema
        .findOne({ userId: owner.id })
        .then((x) => x.factory)

      if (User.id === message.author.id) {
        message.reply('Você pediu demissão com sucesso!')
        await profileSchema.findOneAndUpdate(
          {
            userId: owner.id,
          },
          { $pull: { 'factory.employers': message.author.id } }
        )

        await profileSchema.findOneAndUpdate(
          { userId: message.author.id },
          {
            $set: {
              'factory.owner': 'null',
              'factory.hasFactory': false,
            },
          }
        )
        return
      } else {
        if (message.author.id != fb.createFactory) {
          message.reply('Você não pode demitir alguém!')
          return
        }
        if (fd.employers.some((x) => x != User.id)) {
          message.reply('Este usuário não está em sua Fábrica.')
          return
        }
        message.reply('Funcionário demitido com sucesso!')
        await profileSchema.findOneAndUpdate(
          {
            userId: message.author.id,
          },
          { $pull: { 'factory.employers': User.id } }
        )

        await profileSchema.findOneAndUpdate(
          { userId: User.id },
          {
            $set: {
              'factory.owner': 'null',
              'factory.hasFactory': false,
            },
          }
        )
      }
    }

    if (
      ['convidar', 'invite', 'contratar', 'hire'].includes(
        args[0].toLowerCase()
      )
    ) {
      if (User.bot) {
        message.reply(
          'Você não pode contratar um bot para sua Fábrica, nem eu :('
        )
        return
      }

      if (!User || User.id === message.author.id) {
        message.reply('Você deve mencionar quem deseja contratar.')
      } else if (fb.hasFactory) {
        message.reply('Esse membro já está em um Fábrica.')
      } else {
        message.channel
          .send(
            `${User}, o(a) ${message.author} está tentando lhe contratar, aceitas?\n**SIM** - Aceita\n**NÃO** - Recusa`
          )
          .then(async (msg) => {
            let collector = msg.channel.createMessageCollector(
              (m) => m.author.id === User.id,
              {
                max: 1,
                time: 15000,
              }
            )

            collector.on('collect', async (collected) => {
              if (
                ['sim', 'y', 'yes'].includes(collected.content.toLowerCase())
              ) {
                message.reply(`Você contratou com sucesso o(a) ${User}`)

                await profileSchema.findOneAndUpdate(
                  {
                    userId: message.author.id,
                  },
                  { $push: { 'factory.employers': User.id } }
                )

                await profileSchema.findOneAndUpdate(
                  { userId: User.id },
                  {
                    $set: {
                      'factory.owner': message.author.id,
                      'factory.hasFactory': true,
                      'factory.lastWork': 0,
                    },
                  }
                )
                msg.delete()
                collector.stop()
              }

              if (
                ['não', 'no', 'nope', 'n'].includes(
                  collected.content.toLowerCase()
                )
              ) {
                message.reply(`O(a) ${User} recusou o pedido.`)
                msg.delete()
                collector.stop
              }
            })
          })
      }
    }

    if (['up', 'upar', 'subir'].includes(args[0].toLowerCase())) {
      if (!fb.createFactory)
        return message.reply(
          `${message.author}, somente o Dono da fábrica pode upar a fábrica.`
        )

      if (fb.nextLevel * fb.level > fb.exp)
        return message.reply(
          `${message.author}, a fábrica não tem xp o suficiente para upar de level.`
        )

      message.reply(`${message.author}, fábrica elevada com sucesso.`)

      await profileSchema.findOneAndUpdate(
        { userId: message.author.id },
        {
          $set: {
            'factory.level': fb.level + 1,
            'factory.exp': fb.exp - fb.nextLevel * fb.level,
          },
        }
      )

      return
    }

    if (['name', 'nome'].includes(args[0].toLowerCase())) {
      if (!fb.createFactory)
        return message.reply(
          `${message.author}, somente o Dono da fábrica pode alterar o nome dela.`
        )

      const name = args.slice(1).join(' ')

      if (name.length > 40)
        return message.reply(
          `${message.author}, o nome da fábrica deve conter 40 ou menos caracteres.`
        )

      if (fb.name === name)
        return message.reply(
          `${message.author}, o nome inserido é o mesmo setado atualmente.`
        )

      message.reply(
        `${message.author}, o nome da sua fábrica foi alterado com sucesso.`
      )
      await profileSchema.findOneAndUpdate(
        { userId: message.author.id },
        { $set: { 'factory.name': name } }
      )

      return
    }

    if (['create', 'criar'].includes(args[0].toLowerCase())) {
      if (fb.hasFactory) {
        message.reply('Você já tem/faz parte de uma Fábrica!')
        return
      } else if ((await economy.getCoins(guildId, userId)) < 20000) {
        message.reply('Você precisa de **RC20.000** para criar uma Fábrica!')
        return
      } else {
        message.reply('Sua fábrica foi criada com sucesso!')
        const price = 20000
        await economy.addCoins(guild.id, member.id, price * -1)
        await profileSchema.findOneAndUpdate(
          { userId },
          {
            $set: {
              'factory.name': 'null',
              'factory.exp': 0,
              'factory.level': 1,
              'factory.nextLevel': 500,
              'factory.owner': message.author.id,
              'factory.employers': [],
              'factory.hasFactory': true,
              'factory.createFactory': true,
              'factory.lastWork': 0,
            },
          }
        )
      }
    }
  }
  async PUSH(members, list) {
    for (const employer of list) {
      const doc = await this.client.database.users
        .findOne({ userId: employer })
        .then((x) => x.factory)
      members.push({
        user: await this.client.users.fetch(employer).then((user) => {
          return user
        }),
        lastWork: doc.lastWork,
      })
    }
  }
  generateRandomNumber(min, max) {
    min = Math.ceil(min)
    max = Math.ceil(max)

    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
