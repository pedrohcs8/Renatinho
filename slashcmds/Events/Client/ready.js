module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    require('../../Systems/lockdown-system')(client)
    require('../../Systems/chat-filter-system')(client)

    console.log('Os slashcommands estão prontos!')
  },
}
