// const { MessageEmbed } = require("discord.js");

// module.exports = class {
//   constructor(client) {
//     this.client = client;
//   }

//   async run(guild) {
//       try {
//     const LEAVE = new MessageEmbed()
//       .setTimestamp()
//       .setColor(process.env.EMBED_COLOR)
//       .setThumbnail(guild.iconURL({ dynamic: true, size: 2048 }));

//       const owner = await guild.fetchOwner()

//       LEAVE.setAuthor(`${guild.client.user.username} | Removido de um Servidor`
//       ).addFields(
//         {
//             name: `Nome do Servidor`,
//             value: `${guild.name}`,
//             inline: true,
//           },
//           {
//             name: `ID Do Servidor`,
//             value: `${guild.id}`,
//             inline: true,
//           },
//           {
//             name: `Propietário`,
//             value: `${owner}`,
//             inline: true,
//           },
//           {
//             name: `ID Do Propietário`,
//             value: `${owner.id}`,
//             inline: true,
//           },
//           {
//             name: `Total de Usuários`,
//             value: `${guild.memberCount}`,
//             inline: true,
//           },
//           {
//             name: `Total de Canais`,
//             value: `${guild.channels.cache.size}`,
//             inline: true,
//           }
//         )

//         this.client.channels.cache.get(process.env.CHANNEL_LOGS).send({ embeds: [LEAVE] })
//   } catch (err) {
//     console.log(`EVENTO: GuildDelete ${err}`);
//   }
// };
// }
