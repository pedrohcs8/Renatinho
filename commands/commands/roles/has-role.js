//Mostra se uma pessoa tem o cargo
module.exports = {
    commands: 'hasrole',
    mimArgs: 2,
    expectedArgs: "<Usuário alvo @> <Nome do cargo>",
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments) => {
      const targetUser = message.mentions.users.first()
      if (!targetUser) {
        message.reply('Por favor especifique alguém para dar o cargo.')
        return
      }
  
      arguments.shift()
  
      const roleName = arguments.join(' ')
      const { guild } = message
  
      const role = guild.roles.cache.find((role) => {
        return role.name === roleName
      })
      if (!role) {
        message.reply(`Não existe nnhum cargo com o nome "${roleName}"`)
        return
      }
  
      const member = guild.members.cache.get(targetUser.id)
  
      if (member.roles.cache.get(role.id)) {
        message.reply(`O usuário tem o cargo ${roleName}`)
      } else {
        message.reply(`Este usuário não tem o cargo ${roleName}`)
      }
    }
  }