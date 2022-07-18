//Deleta um canal
module.exports = {
  commands: ['deletechannel', 'delchannel'],
  maxArgs: 0,
  permissionError: 'Você não tem permissão para usar esse comando.',
  permissions: 'ADMINISTRATOR',
  callback: (messsage, arguments, text) => {
    messsage.channel.delete()
  },
}