const guildSchema = require('../../schemas/guild-schema')

async function loadConfig(client) {
  ;(await guildSchema.find()).forEach((doc) => {
    client.guildConfig.set(doc.idS, {
      logChannel: doc.autorole.logChannel,
      memberRoles: doc.autorole.memberRoles,
      botRoles: doc.autorole.botRoles,
    })
  })

  return console.log(
    'Carreguei as configurações dos servidores para o cache (Collection)'
  )
}

module.exports = { loadConfig }
