//Dá um cargo
module.exports = {
  commands: 'giverole',
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
    member.roles.add(role)

    message.reply(`Este usuário agora tem o cargo "${roleName}"`)
  }
}