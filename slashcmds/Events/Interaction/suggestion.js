// const { ButtonInteraction } = require('discord.js')
// const DB = require('../../../schemas/suggest-schema')

// module.exports = {
//   name: 'interactionCreate',

//   /**
//    *
//    * @param {ButtonInteraction} interaction
//    */

//   async execute(interaction) {
//     if (!interaction.isButton()) {
//       return
//     }

//     if (!interaction.member.permissions.has('ADMINISTRATOR')) {
//       return interaction.reply({
//         content: 'Você não pode usar este botão!',
//         ephemeral: true,
//       })
//     }

//     const { guildId, customId, message } = interaction

//     DB.findOne(
//       { guildId: guildId, messageId: message.id },
//       async (err, data) => {
//         if (err) {
//           throw err
//         }

//         if (!data) {
//           return
//         }

//         const Embed = message.embeds[0]
//         if (!Embed) {
//           return
//         }

//         switch (customId) {
//           case 'aceitar':
//             {
//               Embed.fields[2] = {
//                 name: 'Status:',
//                 value: 'Aceito',
//                 inline: true,
//               }
//               message.edit({
//                 embeds: [Embed.setColor('GREEN')],
//                 components: [],
//               })
//               interaction.reply({
//                 content: 'Sugestão aceita',
//                 components: [],
//                 ephemeral: true,
//               })
//             }
//             break

//           case 'rejeitar':
//             {
//               Embed.fields[2] = {
//                 name: 'Status:',
//                 value: 'Rejeitado',
//                 inline: true,
//               }
//               message.edit({ embeds: [Embed.setColor('RED')], components: [] })
//               interaction.reply({
//                 content: 'Sugestão rejeitada',
//                 ephemeral: true,
//               })
//             }
//             break
//         }
//       }
//     )
//   },
// }
