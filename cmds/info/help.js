const Command = require('@util/structures/Command')
const ClientEmbed = require('@structures/ClientEmbed')

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'help'
    this.category = 'Info'
    this.description = 'Comando para ver o menu de ajuda'
    this.usage = 'help [comando]'
    this.aliases = ['help']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const Misc = []
    const Info = []
    const Music = []
    const Economy = []
    const Moderation = []
    const Fun = []
    const Util = []
    const Games = []
    const Minecraft = []
    const Config = []
    const Dono = []
    const Sorteios = []
    const SemCategoria = []
    const Registrador = []
    const Iraq = []

    const { commands } = message.client

      const embed = new ClientEmbed(author)
      .setTimestamp()
      .setFooter('[] = opcional, <> = obrigatório')

    if (args[0]) {
      const name = args[0].toLowerCase()
      const sub = args[1]

      let comando

      if (sub) {
        comando = this.client.subcommands.get(name).get(sub)
      } else {
        comando =
          commands.get(name) ||
          commands.find((cmd) => cmd.aliases.includes(name))
      }

      if (!comando) {
        message.reply(`Não achei nenhum comando com o nome/aliase **${name}**`)
        return
      }

      embed.addField(`Comando:`, comando.name)

      if (comando.aliases) {
        embed.addField(
          `Aliases`,
          !comando.aliases.join(', ')
            ? 'Nenhuma Aliase'
            : comando.aliases.join(', ')
        )
      }
      if (comando.description) {
        embed.addField(`Descrição`, comando.description)
      }
      if (comando.usage) {
        embed.addField(`Modo de Uso`, comando.usage)
      }

      message.reply({ embeds: [embed] })
    } else {
      commands.map((cmd) => {
        if (cmd.category === 'Info') {
          Info.push(cmd.name)
        } else if (cmd.category == 'Economy') {
          Economy.push(cmd.name)
        } else if (cmd.category == 'Games') {
          Games.push(cmd.name)
        } else if (cmd.category == 'Minecraft') {
          Minecraft.push(cmd.name)
        } else if (cmd.category == 'Misc') {
          Misc.push(cmd.name)
        } else if (cmd.category == 'Moderation') {
          Moderation.push(cmd.name)
        } else if (cmd.category == 'Dono') {
          Dono.push(cmd.name)
        } else if (cmd.category == 'Fun') {
          Fun.push(cmd.name)
        } else if (cmd.category == 'Music') {
          Music.push(cmd.name)
        } else if (cmd.category == 'Util') {
          Util.push(cmd.name)
        } else if (cmd.category == 'Config') {
          Config.push(cmd.name)
        } else if (cmd.category == 'Sorteio') {
          Sorteios.push(cmd.name)
        } else if (cmd.category == 'Registrador') {
          Registrador.push(cmd.name)
        } else if (cmd.category == 'Iraq Technology') {
          Iraq.push(cmd.name)
        } else SemCategoria.push(cmd.name)
      })

      const logo = 'https://i.imgur.com/3p2qyiZ.jpg'

      const embed2 = new ClientEmbed(author)
        .setColor('#4B088A')
        .setTimestamp()
        .setDescription(
          `**${message.author.username}**, lista de todos os meu comandos. \nCaso queira saber mais sobre algum use **.help <comando/aliases>**.\nTotal de **${this.client.commands.size}** comandos`
        )
        .setImage(logo)
        .addFields(
          {
            name: 'Informação',
            value: !Info.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Info.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Economia',
            value: !Economy.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Economy.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Jogos',
            value: !Games.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Games.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Diversão',
            value: !Fun.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Fun.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Música',
            value: !Music.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Music.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Minecraft',
            value: !Minecraft.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Minecraft.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Utilitários',
            value: !Util.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Util.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Micelâneos',
            value: !Misc.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Misc.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Moderação',
            value: !Moderation.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Moderation.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Configurações',
            value: !Config.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Config.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Dono',
            value: !Dono.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Dono.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Iraq Technology',
            value: !Iraq.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : Iraq.map((x) => `\`${x}\``).join(', '),
          },
          {
            name: 'Sem Categoria',
            value: !SemCategoria.map((x) => `\`${x}\``).join(', ')
              ? 'Nenhum'
              : SemCategoria.map((x) => `\`${x}\``).join(', '),
          }
        )

      message.reply({ embeds: [embed2] })
    }
  }
}
