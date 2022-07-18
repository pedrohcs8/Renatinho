const mongoose = require('mongoose')
const c = require('colors')
const { mongoPath } = require('@root/config.json')

module.exports = {
    start() {
        try {
            mongoose.connect(mongoPath, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })

            console.log(c.red(`[DataBase] - Conectado ao Banco de Dados.`))
        } catch (err) {
            if (err) return console.log(c.red(`[DataBase] - ERROR:`, +err))
        }
    },
}