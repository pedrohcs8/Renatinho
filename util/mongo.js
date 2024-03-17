//Conecta a mongoDB ao meu código
const mongoose = require('mongoose')
const { mongoPath } = require('@root/config.json')

module.exports = async () => {
  mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
}
