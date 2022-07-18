const Command = require('@util/structures/Command')
const malScraper = require('mal-scraper')
const translate = require('@iamtraction/google-translate')
const moment = require('moment')
const ClientEmbed = require('@structures/ClientEmbed')
require('moment-duration-format')

module.exports = class AnimeCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'anime'
    this.category = 'Fun'
    this.description = 'Comando para pesquisar sobre o anime desejado'
    this.usage = 'anime <nome>'
    this.aliases = ['anime']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    const search = args.join(' ')

    if (!search) {
      message.reply('Insira o nome do anime á ser pesquisado')
      return
    }

    const data = await malScraper.getInfoFromName(search)

    const language = 'pt-br'

    const trad = await translate(data.synopsis, {
      to: language.slice(0, 2),
    })

    const date = data.aired.split(' to ').map((x) => x.replace(',', ''))

    console.log(data)

    const name = data.characters.map((x) => x.name).slice(0, 2)
    const names = name.map((x) => x.replace(',', ''))

    const anime = new ClientEmbed(author)
      .setDescription(
        `**[${data.title}](${data.url})**\n${
          trad.text.length > 900 ? trad.text.slice(0, 900) + '...' : trad.text
        }`,
      )
      .setThumbnail(data.picture)
      .addFields(
        {
          name: `Episódios`,
          value: data.episodes.toLocaleString(),
          inline: true,
        },
        {
          name: `Tipo do anime`,
          value: data.type,
          inline: true,
        },
        {
          name: `Rank do anime`,
          value: data.ranked,
          inline: true,
        },
        {
          name: 'Popularidade',
          value: data.popularity,
          inline: true,
        },
        {
          name: 'Status do anime',
          value: data.status
            .replace('Finished Airing', 'Finalizado')
            .replace('Currently Airing', 'Em lançamento'),
          inline: true,
        },
        {
          name: 'Categoria do anime',
          value: data.source,
          inline: true,
        },
        {
          name: 'Personagens Principais',
          value: names.join(', '),
          inline: true,
        },
        {
          name: `Sobre o lançameto`,
          value:
            date[1] == '?' || !date[1]
              ? `**${moment(new Date(date[0])).format('L')}**`
              : `**${moment(new Date(date[0])).format('L')}** - **${moment(
                  new Date(date[1]),
                ).format('L')}**`.toString(),
          inline: true,
        },
        {
          name: 'Duração dos episódios',
          value: data.duration.replace('. per ep', ''),
        },
        {
          name: 'Gêneros',
          value: data.genres.map((x) => x).join(', '),
        },
        {
          name: 'Nota do anime',
          value: data.score,
        },
      )

    if (data.trailer !== undefined) {
      anime.addField(`Trailer do anime`, `**[Clique Aqui](${data.trailer})**`)
    }

    message.reply({ embeds: [anime] }).catch((err) => {
      console.log(err)
      message.reply(`Anime não encontrado`)
      return
    })
  }
}
