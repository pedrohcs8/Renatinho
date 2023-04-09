const { Client } = require('discord.js')
const { loadFiles } = require('../Functions/fileLoader')

/**
 *
 * @param {Client} client
 */

async function loadEvents(client) {
  console.time('Eventos carregados com sucesso')

  client.events = new Map()
  const events = new Array()

  const files = await loadFiles('slashcmds/Events')

  for (const file of files) {
    try {
      const event = require(file)
      const execute = (...args) => event.execute(...args, client)
      const target = event.rest ? client.rest : client

      target[event.once ? 'once' : 'on'](event.name, execute)
      client.events.set(event.name, execute)

      events.push({ Evento: event.name, Status: '✅' })
    } catch (error) {
      events.push({ Evento: file.split('/').pop().slice(0, -3), Status: '⛔' })
    }
  }

  console.table(events, ['Evento', 'Status'])
  console.info('\n\x1b[36m%s\x1b[0m', 'Carreguei os eventos.')
  console.timeEnd('Eventos carregados com sucesso')
}

module.exports = { loadEvents }
