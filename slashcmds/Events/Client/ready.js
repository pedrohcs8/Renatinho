const { loadCommands } = require('../../Handlers/Commands')

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    // require('../../Systems/lockdown-system')(client)
    // require('../../Systems/chat-filter-system')(client)

    loadCommands(client)

    console.log('Os slashcommands estão prontos!')
  },
}
