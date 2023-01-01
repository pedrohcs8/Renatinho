const Guild = require('@schemas/guild-schema'),
    User = require('@schemas/profile-schema'),
    Commands = require('@schemas/command-schema'),
    Client = require('@schemas/client-schema')
const parser = new (require('rss-parser'))()

module.exports = class {
    constructor(client) {
        this.client = client
    }

    async run() {
        this.client.database.users = User
        this.client.database.guilds = Guild
        this.client.database.clientUtils = Client
        this.client.database.commands = Commands

        //Status custom aleatório
        setInterval(() => {
            const statuses = [
                `Criado por pedrohcs8`,
                `Em desenvolvimento`,
                `Com host :)`,
                `Renato online!`,
                `Meu prefixo padrão é .`,
                `Hospedado em um Raspberry Pi 4!`,
                `Online - Cluster 1-Renato-Host`,
                `Use .help se necessário`,
            ]

            const status = statuses[Math.floor(Math.random() * statuses.length)]
            this.client.user.setActivity(status, { type: 'PLAYING' })
        }, 5000)
        await this.YouTube()
    }

    async YouTube() {
        let database = await this.client.database.guilds.find({})

        database = database.filter((x) => x.youtube.length >= 1)

        const array = []

        if (database.length >= 1)
            for (const value of database) array.push(...value.youtube)

        this.client.youtubeChannels = array

        this.client.existingVideos = new Map()

        const verifyVideos = async () => {
            this.client.youtubeChannels.map(async (x) => {
                setTimeout(async () => {
                    const getVideos = await parser
                        .parseURL(
                            `https://www.youtube.com/feeds/videos.xml?channel_id=${x.id}`
                        )
                        .catch(() => {
                            return
                        })

                    if (!getVideos || !getVideos.items.length) return

                    if (!this.client.existingVideos.get(x.id))
                        return this.client.existingVideos.set(x.id, getVideos.items || [])

                    const existingVideos = this.client.existingVideos.get(x.id)
                    const newVideos = getVideos.items.filter(
                        (y) => !existingVideos.find((f) => f.link === y.link)
                    )

                    const removed = existingVideos.filter(
                        (y) =>
                            y.messageID && !getVideos.items.find((f) => f.link === y.link)
                    )

                    removed.map(async (f) => {
                        const channel = await this.client.channels.fetch(x.textChannel)

                        const message = await channel.messages
                            .fetch(f.messageID)
                            .catch(() => {
                                return
                            })

                        if (message)
                            setTimeout(
                                () =>
                                    /*message.delete().catch(() => {
                                      return;
                                    }),*/
                                    5000
                            )

                        existingVideos.splice(
                            existingVideos.indexOf(
                                existingVideos.find((y) => y.link === f.link)
                            ),
                            1
                        )
                    })

                    if (!newVideos.length) return

                    newVideos.map(async (f) => {
                        const MSG = await this.client.channels.fetch(x.textChannel)

                        MSG.send(x.msg).catch(() => {
                            existingVideos.push({
                                link: f.link,
                                messageID: MSG.id,
                            })
                        })

                        existingVideos.push({ link: f.id, messageID: MSG.id })
                    })
                }, 30000)
            })
        }

        verifyVideos()

        setInterval(() => {
            verifyVideos()
        }, 30000)
    }
}