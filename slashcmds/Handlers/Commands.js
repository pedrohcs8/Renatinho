let commandsArray = []
let helpArray = []

async function loadCommands(client) {
  const { loadFiles } = require('../Functions/fileLoader')
  const ascii = require('ascii-table')

  const table = new ascii().setHeading('Comandos', 'Status')

  await client.slashcommands.clear()
  await client.slashsub.clear()

  const Files = await loadFiles('slashcmds/Commands')

  Files.forEach((file) => {
    const command = require(file)

    if (command.subCommand) {
      return client.slashsub.set(command.subCommand, command)
    }

    helpArray.push({
      name: command.data.name,
      category: !command.category ? 'Nenhuma' : command.category,
      description: command.data.description,
    })

    client.slashcommands.set(command.data.name, command)

    commandsArray.push(command.data.toJSON())

    table.addRow(command.data.name, '✅')
  })

  client.application.commands.set(commandsArray)

  return console.log(table.toString(), '\nComandos Carregados.')
}

module.exports = { loadCommands, helpArray }
