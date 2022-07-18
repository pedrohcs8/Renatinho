const { MessageEmbed } = require('discord.js')
const Command = require('@util/structures/Command')

module.exports = class SobreMimCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'botprofile'
    this.category = 'Info'
    this.description = 'Comando para saber mais de mim.'
    this.usage = 'botprofile'
    this.aliases = ['botprofile', 'botp']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const embed = new MessageEmbed()
      .setColor('#F4FA58')
      .setTitle('Meu nome é Renatinho e aqui tem um pouco da minha história:')
      .addFields(
        {
          name: 'Fui criado por:',
          value: `**pedrohcs8#4185**(contacte ele se achar algum bug :))`,
        },
        {
          name: 'Quando fui criado:',
          value: `Fui criado em um **sábado, dia ‎2‎ de ‎janeiro‎ de ‎2021, ás ‏‎00:36:28**`,
        },
        {
          name: 'Porque fui criado:',
          value: `Fui criado inicialmente para um sistema de sugestões no servidor **Surpice**, mas ganhei várias outras features com o tempo :)`,
        },
        {
          name: 'Updates:',
          value:
            'Sempre que possível meu criador me atuliza me deixando mais estável e útil :)',
        },
      )

    message.reply({ embeds: [embed] })
  }
}
