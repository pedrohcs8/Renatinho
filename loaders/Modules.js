const Files = require('@util/Files')

module.exports = new (class Modules {
  async load(client) {
    return Files.requireDirectory('./modules', (Module) => {
      new Module(client).run()
    })
  }
})()
