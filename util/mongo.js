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

//mongodb+srv://LeitorRenato:x7hFbt5hOXVZttw1@cluster0.o1kvn.mongodb.net/renator?retryWrites=true&w=majority
//mongodb+srv://LeitorRenato:x7hFbt5hOXVZttw1@cluster0.o1kvn.mongodb.net/renator?retryWrites=true&w=majority
