module.exports = async (client, PG, Ascii) => {
    const table = new Ascii('Handler de Botões')
    const buttonsFolder = await PG(`${process.cwd()}/slashcmds/Buttons/*/*.js`)

    buttonsFolder.map(async (file) => {
        const buttonFile = require(file)

        if (!buttonFile.id) {
            return
        }

        client.buttons.set(buttonFile.id, buttonFile)
        table.addRow(buttonFile.id, 'Carregado')
    })

    console.log(table.toString())
}