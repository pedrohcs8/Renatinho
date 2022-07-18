module.exports = (client) => {
    client.on('guildMemberAdd', (member) => {
        console.log(`${member.id} entrou no server`)
    })
    client.on('guildMemberLeave', (member) => {
        console.log(`${member.id} saiu no server`)
    })
}
