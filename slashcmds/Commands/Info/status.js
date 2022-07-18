const {
  CommandInteraction,
  Client,
  MessageEmbed,
  Guild,
} = require('discord.js')
const { connection } = require('mongoose')

module.exports = {
  name: 'status',
  description: 'Mostra as informações do bot',
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const a = require('../../../package.json')

    let b = []
    let c = []

    const dep = Object.keys(a.dependencies)
    dep.forEach((x) => b.push(x))
    dep.forEach((x) => c.push(a.dependencies[`${x}`]))

    var texto = b
      .map(function (itm, i) {
        return [
          '- ' + `**${itm}**` + ':' + ' ' + `\`${c[i].replace('^', '')}\``,
        ]
      })
      .join('\n')

    const Response = new MessageEmbed()
      .setColor('#8000FF')
      .setTitle('Renatinho Status')
      .setDescription(
        `**Client**: \`🟢 ONLINE\` - \`${
          client.ws.ping
        }ms\`\n **Uptime**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n
            **Database**: \`${switchTo(
              connection.readyState
            )}\` \n \n **__Pacotes Utilizados__**: 
         - **Node.js**: \`${process.version}\`\n - **Discord.js**: \`${
          require('discord.js').version
        }\`\n - **MongoDB**: \`${
          require('mongoose').version
        }\`\n - **Mongoose**: \`${
          require('mongoose').version
        }\`\n - **Discord.js-Commands**: \`${
          require('../../../package.json').version
        }\`\n ${texto}`
      )
      .addField(
        '**__Comandos__**',
        `\`${client.commands.size}\` comandos carregados.`,
        true
      )
      .addField(
        '**__Servidores__**',
        `\`${client.guilds.cache.size}\` servidores conectados.`,
        true
      )
      .addField(
        '**__Usuários__**',
        `\`${client.users.cache.size}\` usuários conectados.`,
        true
      )
      .setThumbnail(
        client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
      )
      .setTimestamp()
      .setFooter('Feito por pedrohcs8')

    interaction.reply({ embeds: [Response], ephemeral: false })
  },
}

function switchTo(val) {
  var status = ' '
  switch (val) {
    case 0:
      status = '🔴 DESCONECTADO'
      break
    case 1:
      status = `🟢 CONECTADO`
      break
    case 2:
      status = `🟡 CONECTANDO`
      break
    case 3:
      status = `🔵 DESCONECTANDO`
      break
  }
  return status
}
