//Mostra a quantidade de convites que alguém tem
module.exports = {
    commands: 'invites',
    callback: (message) => {
      const { guild } = message
  
      guild.fetchInvites().then((invites) => {
        const inviteCounter = {}
  
        invites.forEach((invite) => {
          const { uses, inviter } = invite
          const { username, discriminator } = inviter
  
          const name = `${username}#${discriminator}`
  
          inviteCounter[name] = (inviteCounter[name] || 0) + uses
        })
  
        let replyText = 'Convites:'
  
        const sortedInvites = Object.keys(inviteCounter).sort((a, b) => inviteCounter[b] - inviteCounter[a])
  
        for (const invite of sortedInvites) {
          const count = inviteCounter[invite]
          replyText += `\n${invite} convidou ${count} membro(s)!`
        }
  
        message.reply(replyText)
      })
    }
  }