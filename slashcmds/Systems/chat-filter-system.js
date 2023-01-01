const schema = require('../../schemas/filter-schema')

module.exports = (client) => {
  schema.find().then((documents) => {
    documents.forEach((doc) => {
      client.filters.set(doc.guildId, doc.words)
      client.filtersLog.set(doc.guildId, doc.log)
    })
  })
}
