// //Comando de Profile Personalizado!

// const Command = require('@util/structures/Command')
// const economy = require('@features/economy')
// const profileSchema = require('@schemas/profile-schema')
// const fs = require('fs')
// const path = require('path')
// const { MessageAttachment, MessageEmbed } = require('discord.js')
// const download = require('node-image-downloader')
// const c = require('colors')

// const NodeCouchDB = require('node-couchdb')
// const couch = new NodeCouchDB({
//   auth: {
//     user: 'admin',
//     password: 'admin',
//   },
//   host: '192.168.0.119',
//   protocol: 'http',
//   port: 5984,
// })

// const dbName = 'renatinho-photos'
// const viewUrl = '_design/all_images/_view/all'

// module.exports = class CustomBackgroundCommand extends Command {
//   constructor(client) {
//     super(client)
//     this.client = client

//     this.name = 'custombackground'
//     this.category = 'Economy'
//     this.description = 'Comando para usar um background seu no profile'
//     this.usage =
//       'custombackground [cor da fonte (no padrão hex!(use esse site: https://html-color-codes.info))] <anexo de uma imagem>'
//     this.aliases = ['custombg', 'cbg']

//     this.enabled = true
//     this.guildOnly = true
//   }

//   async run({ message, args, prefix, author }) {
//     let image = message.attachments.first().url
//     const filename = message.attachments.first().name
//     let color
//     if (args[0]) {
//       color = args[0]
//     } else {
//       color = '#FFFFFF'
//     }

//     console.log(filename)

//     if (!image) {
//       message.reply(
//         'Você deve anexar uma imagem em sua mensagem para ser seu background'
//       )
//       return
//     }

//     // //---------------------------------------/DB/---------------------------
//     couch.listDatabases().then(function (dbs) {
//       console.log(dbs)
//     })

//     const userId = message.author.id
//     const guildId = message.guild.id

//     // //---------------------------------------/Inserir na DB/---------------------------
//     const options = {
//       url: `${image}`,
//       dest: './images', // will be saved to /path/to/dest/image.jpg
//     }

//     if (message.attachments.first().size > 6000000) {
//       message.reply(
//         'Essa imagem é muito grande ( ~~Os bots só podem mandar imagens até 8mb!~~ )'
//       )
//       return
//     }

//     const result = await couch.get(dbName, viewUrl)

//     const data = await result.data

//     const index = data.rows.filter((x) => x.value.userId == `${userId}`)

//     if (index[0]) {
//       if (index[0].value.userId == userId) {
//         if (index[0].value.filename === filename) {
//           fs.unlinkSync(`./images/${index[0].value.filename}`)
//           console.log(c.red('Arquivo antigo deletado!'))
//         }

//         couch.update(dbName, {
//           _id: `${index[0].value.docId}`,
//           _rev: `${index[0].value.rev}`,
//           userId: userId,
//           guildId: guildId,
//           filename: filename,
//           color: `${!args[0] ? index[0].value.color : args[0]}`,
//         })

//         await download
//           .image(options)
//           .then(({ filename }) => {
//             console.log('Saved to', filename) // saved to /path/to/dest/image.jpg
//           })
//           .catch((err) => console.error(err))

//         await profileSchema.findOneAndUpdate(
//           { userId: message.author.id },
//           { $push: { 'backgrounds.has': 4 } }
//         )
//         await profileSchema.findOneAndUpdate(
//           { userId: message.author.id },
//           { $set: { 'backgrounds.active': 4 } }
//         )

//         message.reply(
//           'Background personalizado atualizado ( ~~De Graça! Os updates são gratuitos! :D~~ )'
//         )
//         return
//       }
//     } else {
//       let coinsOwned = await economy.getCoins(guildId, userId)

//       if (coinsOwned === undefined) {
//         coinsOwned = 0
//       }

//       if (coinsOwned < 20000) {
//         i.reply(
//           'Você não tem dinheiro suficiente para comprar esse background.'
//         )
//         return
//       }

//       await economy.addCoins(guildId, userId, 20000 * -1)

//       await download
//         .image(options)
//         .then(({ filename }) => {
//           console.log('Saved to', filename) // saved to /path/to/dest/image.jpg
//         })
//         .catch((err) => console.error(err))

//       const id = `images:${userId}`
//       couch.insert(dbName, {
//         _id: id,
//         userId: userId,
//         guildId: guildId,
//         filename: filename,
//         color: color,
//       })

//       await profileSchema.findOneAndUpdate(
//         { userId: message.author.id },
//         { $set: { 'backgrounds.active': 4 } }
//       )

//       await profileSchema.findOneAndUpdate(
//         { userId: message.author.id },
//         { $push: { 'backgrounds.has': 4 } }
//       )

//       message.reply('Background adicionado e ativo!')
//     }
//   }
// }

// // this.base64_decode(base64, 'images/teste.png')
