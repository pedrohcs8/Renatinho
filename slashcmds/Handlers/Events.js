const { Events } = require('../Validation/eventnames')
const { promisify } = require('util')
const { glob } = require('glob')
const PG = promisify(glob)
const Ascii = require('ascii-table')

module.exports = async (client, PG, Ascii) => {
  const Table = new Ascii('Eventos Carregados')

  ;(await PG(`${process.cwd()}/slashcmds/Events/*/*.js`)).map(async (file) => {
    const event = require(file)

    if (!Events.includes(event.name) || !event.name) {
      const L = file.split('/')
      await Table.addRow(
        `${event.name || 'Faltando'}`,
        `🛑 O nome do evento é inválido ou não existe: ${L[6] + `/` + L[7]}`
      )
      return
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client))
    } else {
      client.on(event.name, (...args) => event.execute(...args, client))
    }

    await Table.addRow(event.name, '✅ - Sucesso')
  })

  console.log(Table.toString())
}
