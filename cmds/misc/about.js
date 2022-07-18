const Command = require('@util/structures/Command')
const profileSchema = require('@schemas/profile-schema')

module.exports = class AboutCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'sobremim'
    this.category = 'Misc'
    this.description = 'Comando para mudar o sobre mim de seu perfil'
    this.usage = 'sobremim [texto]'
    this.aliases = ['sobremim']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const about = args.join(' ')
    const results = await profileSchema.findOne({ userId: message.author.id })
    const { dabout } = results

    if (!about) {
      message.reply(
        'Você não inseriu oque deseja colocar na aba sobremim de seu perfil.'
      )
      return
    }

    if (about.length > 300) {
      message.reply(
        'Sua mensagem para coloacar no sobremim é muito longa!(máximo 300 caracteres).'
      )
    }

    if (dabout == about) {
      message.reply('O sobre colocado é igual ao atual.')
    }

    message.reply('Seu sobremim foi alterado com sucesso!')

    await profileSchema.findOneAndUpdate(
      { userId: message.author.id },
      { $set: { about: about } }
    )
  }
}
