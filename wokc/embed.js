module.exports = {
    minArgs: '2',
    expectedArgs: '<# do canal> <JSON>',
    callback: ({ message, args }) => {
        const targetChannel = message.mentions.channels.first()
        if (!targetChannel) {
            message.reply('Por favor especifique um canal para mandar o embed.')
            return
        }

        args.shift()
        try {
            const json = JSON.parse(args.join(' '))
            const { text = '' } = json

            targetChannel.send(text, {
                embed: json,
            })
        } catch (error) {
            message.reply(`JSON inválido ${error.message}`)
        }
    },
}
