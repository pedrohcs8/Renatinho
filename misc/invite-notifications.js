//Mostra quem entrou e quem o convidou

module.exports = (client) => {
  const invites = {}

  const getInviteCounts = async (guild) => {
    return await new Promise((resolve) => {
      guild.invites.fetch().then((invites) => {
        const inviteCounter = {}

        invites.forEach((invite) => {
          const { uses, inviter } = invite
          const { username, discriminator } = inviter

          const name = `${username}#${discriminator}`

          inviteCounter[name] = (inviteCounter[name] || 0) + uses
        })

        resolve(inviteCounter)
      })
    })
  }

  client.guilds.cache.forEach(async (guild) => {
    invites[guild.id] = await getInviteCounts(guild)
  })

  client.on('guildMemberAdd', async (member) => {
    const { guild, id } = member

    const invitesBefore = invites[guild.id]
    const invitesAfter = await getInviteCounts(guild)

    console.log('BEFORE:', invitesBefore)
    console.log('AFTER:', invitesAfter)

    for (const inviter in invitesAfter) {
      if (invitesBefore[inviter] === invitesAfter[inviter] - 1) {
        const channelId = '787374201882935306'
        const channel = guild.channels.cache.get(channelId)
        const count = invitesAfter[inviter]
        channel.send(
          `Bem vindo(a) <@${id}> ao servidor! Convidado por ${inviter} (${count} convites)`,
        )

        invites[guild.id] = invitesAfter
        return
      }
    }
  })
}
