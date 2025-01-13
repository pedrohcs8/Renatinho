const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js')

const CommandHandler = require('../../Handlers/Commands')

const returnToHome = (interaction) => {
  const { user, guild } = interaction
  const { helpArray } = CommandHandler

  const embed = new EmbedBuilder()
    .setTitle('Ajuda do Renatinho')
    .setDescription(
      `Olá ${user}, meu nome é **Renatinho** e fui criado por <@227559154007408641> e tenho **${getDaysAlive(
        Date.now()
      )}** dias de vida!
        
        Fui criado com o objetivo de ajudar a moderarem servidores, escutar músicas em call e se divertir com meus sistemas de economia!
        
        Espero poder ajudar na sua jornada em **${guild.name}**`
    )
    .setColor(process.env.EMBED_COLOR)
    .setThumbnail('https://i.imgur.com/f6yrLEe.png')

  // Create a Set to store unique "type" values
  const uniqueCategories = new Set()

  // Iterate through the array and add each "type" to the Set
  helpArray.forEach((obj) => {
    uniqueCategories.add(obj.category)
  })

  // Convert the Set to an array
  const uniqueCategoriesArr = [...uniqueCategories]
  uniqueCategoriesArr.sort()

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('help_menu_list')
      .setPlaceholder('Meus Comandos!')
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        uniqueCategoriesArr.map((category) => {
          return {
            label: `${category}`,
            description: `${selectDescription(category)}`,
            value: `${category}`,
          }
        })
      )
  )

  interaction.update({ embeds: [embed], components: [row] })
}

module.exports = {
  category: 'Informação',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Comando para ver informações sobre os comandos do bot'),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { user, guild } = interaction
    const { helpArray } = CommandHandler

    const embed = new EmbedBuilder()
      .setTitle('Ajuda do Renatinho')
      .setDescription(
        `Olá ${user}, meu nome é **Renatinho** e fui criado por <@227559154007408641> e tenho **${getDaysAlive(
          Date.now()
        )}** dias de vida!
        
        Fui criado com o objetivo de ajudar a moderarem servidores, escutar músicas em call e se divertir com meus sistemas de economia!
        
        Espero poder ajudar na sua jornada em **${guild.name}**`
      )
      .setColor(process.env.EMBED_COLOR)
      .setThumbnail('https://i.imgur.com/f6yrLEe.png')

    // Create a Set to store unique "type" values
    const uniqueCategories = new Set()

    // Iterate through the array and add each "type" to the Set
    helpArray.forEach((obj) => {
      uniqueCategories.add(obj.category)
    })

    // Convert the Set to an array
    const uniqueCategoriesArr = [...uniqueCategories]
    uniqueCategoriesArr.sort()

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('help_menu_list')
        .setPlaceholder('Meus Comandos!')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
          uniqueCategoriesArr.map((category) => {
            return {
              label: `${category}`,
              description: `${selectDescription(category)}`,
              value: `${category}`,
            }
          })
        )
    )

    interaction.reply({ embeds: [embed], components: [row] })
  },
  returnToHome,
}

const getDaysAlive = (currentDate) => {
  const diffTime = Math.abs(currentDate - new Date(process.env.CREATION_DATE))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const selectDescription = (category) => {
  switch (category) {
    case 'Nenhuma': {
      return 'Esses comandos não tem categoria'
    }

    case 'Economia': {
      return 'Comandos do Sistema de Economia'
    }

    case 'Informação': {
      return 'Comandos para ver informações do bot'
    }

    case 'Moderação': {
      return 'Comandos de Moderação'
    }

    case 'Música': {
      return 'Comando de Música'
    }

    case 'AI': {
      return 'Comandos de Inteligência Artificial'
    }

    default: {
      return 'Preciso ser Programado :P'
    }
  }
}
