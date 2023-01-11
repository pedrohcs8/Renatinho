const guildSchema = require('../../schemas/guild-schema')

async function loadConfig(client) {
  ;(await guildSchema.find()).forEach((doc) => {
    client.guildConfig.set(doc.idS, {
      logChannel: doc.logs.logChannel,
      roles: doc.autorole.roles,
    })
  })

  return console.log(
    'Carreguei as configurações dos servidores para o cache (Collection)'
  )
}

module.exports = { loadConfig }
