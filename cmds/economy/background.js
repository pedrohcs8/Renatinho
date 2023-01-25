//Comando de setar background

const Command = require('@util/structures/Command')
const economy = require('@features/economy')
const profileSchema = require('@schemas/profile-schema')
const fs = require('fs')
const path = require('path')
const { MessageAttachment, MessageEmbed } = require('discord.js')

module.exports = class BackgroundCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'background'
    this.category = 'Economy'
    this.description = 'Comando para trocar o background do profile'
    this.usage = 'background'
    this.aliases = ['bg', 'lojabackground', 'loja-background']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    // const doc = await profileSchema.findOne({ userId: message.author.id })
    // const { guild, member } = message
    // const backgrounds = {
    //   zero: {
    //     id: 0,
    //     price: 0,
    //     background: 'https://i.imgur.com/2mmK532.png',
    //   },
    //   one: {
    //     id: 1,
    //     price: 5000,
    //     background: 'https://i.imgur.com/lXdD2PF.jpg',
    //   },
    //   two: {
    //     id: 2,
    //     price: 10000,
    //     background: 'https://i.imgur.com/4KYQxdS.jpg',
    //   },
    //   three: {
    //     id: 3,
    //     price: 12000,
    //     background: 'https://i.imgur.com/AQGygrA.jpg',
    //   },
    //   four: {
    //     id: 4,
    //     price: 20000,
    //     background: 'seu',
    //   },
    // }
    // if (!args[0]) {
    //   message.reply(
    //     'Sub-comandos do comando de background: **set <ID (0 para padrão)>, buy <ID> e list**.',
    //   )
    // }
    // if (args[0] === 'list') {
    //   const list = doc.backgrounds.has
    //   const embed = new MessageEmbed()
    //     .setTitle('Backgrounds disponíveis')
    //     .setDescription(
    //       `Background Ativo no Momento: **ID ${doc.backgrounds.active}**` +
    //         '\n\n' +
    //         Object.entries(backgrounds)
    //           .filter(([, x]) => x.id != 0)
    //           .map(
    //             ([, x]) =>
    //               `> **[ID ${x.id}](${
    //                 x.background
    //               })**\n> Preço: RC:**${x.price.toLocaleString()}**\n> Status: **${
    //                 list.find((f) => f === x.id)
    //                   ? 'Já possui este background'
    //                   : 'Não tem'
    //               }**`,
    //           )
    //           .join('\n\n'),
    //     )
    //   message.reply({ embeds: [embed] })
    //   return
    // }
    // if (args[0] === 'set') {
    //   if (!args[1]) {
    //     message.reply('Você não inseriu o ID do background desejado.')
    //   }
    //   const id = parseInt(args[1])
    //   const list = doc.backgrounds.has
    //   if (!args[1]) {
    //     message.reply('Você não inseriu o ID do background desejado.')
    //   }
    //   if (id === 0) {
    //     message.reply('Background padrão ativado')
    //     await profileSchema.findOneAndUpdate(
    //       { userId: message.author.id },
    //       { $set: { 'backgrounds.active': id } },
    //     )
    //     return
    //   } else if (id === 4) {
    //     await profileSchema.findOneAndUpdate(
    //       { userId: message.author.id },
    //       { $set: { 'backgrounds.active': 4 } },
    //     )
    //     message.reply('Background personalizado ativo!')
    //     return
    //   } else {
    //     if (!list.find((x) => x === id)) {
    //       return message.reply(`Você não tem esse background`)
    //     }
    //     await profileSchema.findOneAndUpdate(
    //       {
    //         userId: message.author.id,
    //       },
    //       { $set: { 'backgrounds.active': id } },
    //     )
    //     message.reply('Background setado com sucesso')
    //     return
    //   }
    // }
    // if (args[0] === 'buy') {
    //   const list = doc.backgrounds.has
    //   const id = parseInt(args[1])
    //   if (list.find((x) => x === id)) {
    //     message.reply('Você já tem esse background.')
    //     return
    //   }
    //   if (id == 4) {
    //     message.reply(
    //       'Use .custombackground para obter mais informações sobre os backgrounds personalizados!',
    //     )
    //     return
    //   }
    //   let find = Object.entries(backgrounds).filter(([, x]) => x.id === id)[0]
    //   if (!find.length) {
    //     message.reply('Não tenho nenhum background com esse ID.')
    //     return
    //   }
    //   let coinsOwned = await economy.getCoins(guild.id, member.id)
    //   if (coinsOwned === undefined) {
    //     coinsOwned = 0
    //   }
    //   find = find[1]
    //   if (find.price > coinsOwned) {
    //     message.reply(
    //       'Você não tem renatocoins suficientes para comprar esse item.',
    //     )
    //     return
    //   }
    //   message.reply(
    //     `Background comprado e ativado com sucesso! Comprado por RC${find.price}`,
    //   )
    //   await profileSchema.findOneAndUpdate(
    //     { userId: message.author.id },
    //     { $push: { 'backgrounds.has': id } },
    //   )
    //   await profileSchema.findOneAndUpdate(
    //     { userId: message.author.id },
    //     { $set: { 'backgrounds.active': id } },
    //   )
    //   await economy.addCoins(guild.id, member.id, find.price * -1)
    //   return
    // }
  }
}
