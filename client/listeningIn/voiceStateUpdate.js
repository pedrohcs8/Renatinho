const ClientEmbed = require('@structures/ClientEmbed')
const guildSchema = require('@schemas/guild-schema')
const moment = require('moment')
require('moment-duration-format')
 
module.exports = class voiceStateUpdate {
    constructor(client) {
        this.client = client
    }

    async run(oldState, newState) {
        
    //    moment.locale('pt-BR')

    //    let user = newState.member
    //    const member = newState.member
    //    const guild = newState.guild

    //    user = user.user



    //    const doc = await this.client.database.users.findOne({ idU: user.id })
    //    const doc1 = await this.client.database.guilds.findOne({ idS: guild.id })

    //    const createCall = doc1.createCall

    //    if (
    //        createCall.status ||
    //        createCall.users.find((x) => x.channel === oldState.channel.id)
    //    ) {
    //        if (!oldState.channel && newState.channel) {
    //            const channel = guild.channels.cache.get(createCall.channel)

    //            if (newState.channel == createCall.channel) {
    //                console.log('c')
    //                const category = guild.channels.cache.get(createCall.category)

    //                guild.channels
    //                    .create(!user.nickname ? user.username : user.nickname, {
    //                        type: 'GUILD_VOICE',
    //                        reason: 'Sistema de Calls Privadas',
    //                    })
    //                    .then(async (x) => {
    //                        x.setParent(category.id)
    //                        guild.members.cache.get(user.id).voice.setChannel(x)
    //                        await guildSchema.findOneAndUpdate(
    //                            { idS: guild.id },
    //                            {
    //                                $push: {
    //                                    'createCall.users': {
    //                                        user: user.id,
    //                                        channel: x.id,
    //                                        date: Date.now(),
    //                                        guild: guild.id,
    //                                    },
    //                                },
    //                            }
    //                        )
    //                    })
    //            }
    //        }
    //    }

    //    const call = doc?.infoCall
    //    const call2 = doc1?.infoCall

    //    const channel = guild.channels.cache.get(doc1.logs.channel)

    //    if (!call?.status) return

    //    if (oldState.channel && !newState.channel) {
    //        // ===================> Quando O Membro Sai do Canal

    //        console.log('a')

    //        if (
    //            call2.roles.some((x) => member.roles.cache.has(x)) ||
    //            call2.channels.some((x) => x === oldState.channel.id)
    //        )
    //            return

    //        if (doc1.logs.status) {
    //            const EMBED = new ClientEmbed(this.client.user)
    //                .setAuthor(
    //                    `${user.tag} - Saída de Canal`,
    //                    user.displayAvatarURL({ dynamic: true })
    //                )
    //                .setThumbnail(
    //                    user.displayAvatarURL({ dynamic: true, format: 'jpg', size: 2048 })
    //                )
    //                .addField(
    //                    `Tempo que o Membro ficou em Call`,
    //                    moment
    //                        .duration(Date.now() - call.lastCall)
    //                        .format('d [dias] h [horas] m [minutos] s [segundos]')
    //                        .replace('minsutos', 'minutos')
    //                )
    //                .setTimestamp()
    //                .setFooter(user.tag)

    //            channel.send({ embeds: [EMBED] }).catch(() => { })
    //        }

    //        await this.client.database.users.findOneAndUpdate(
    //            { idU: user.id },
    //            {
    //                $set: {
    //                    'infoCall.totalCall': Date.now() - call.lastCall + call.totalCall,
    //                    'infoCall.lastRegister': Date.now() - call.lastCall,
    //                },
    //            }
    //        )
    //    } else if (!oldState.channel && newState.channel) {
    //        // ===================> Quando O Membro Entra no Canal

    //        if (
    //            call2.roles.some((x) => member.roles.cache.has(x)) ||
    //            call2.channels.some((x) => x === newState.channel.id)
    //        )
    //            return

    //        await this.client.database.users.findOneAndUpdate(
    //            { idU: user.id },
    //            { $set: { 'infoCall.lastCall': Date.now() } }
    //        )
    //    }
    }
    
}
