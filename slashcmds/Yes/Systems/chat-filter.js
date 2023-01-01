const { CommandInteraction, Client, MessageEmbed } = require('discord.js')
const schema = require('../../../schemas/filter-schema')

module.exports = {
  name: 'filter',
  description: 'Sistema de filtro do chat.',
  permission: 'MANAGE_MESSAGES',
  options: [
    {
      name: 'help',
      description: 'Help',
      type: 'SUB_COMMAND',
    },
    {
      name: 'clear',
      description: 'Limpa a lista negra do filtro',
      type: 'SUB_COMMAND',
    },
    {
      name: 'list',
      description: 'Limpa a lista negra do filtro',
      type: 'SUB_COMMAND',
    },
    {
      name: 'logs',
      description: 'Configura o sistema de filtro do chat.',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'logging',
          description: 'Selecione o canal de logs do filtro.',
          type: 'CHANNEL',
          channelTypes: ['GUILD_TEXT'],
          required: true,
        },
      ],
    },
    {
      name: 'configurar',
      description: 'Adicione ou remova palavras da lista negra.',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'options',
          description: 'Selecione uma opção',
          type: 'STRING',
          required: true,
          choices: [
            {
              name: 'adicionar',
              value: 'add',
            },
            {
              name: 'remover',
              value: 'remove',
            },
          ],
        },
        {
          name: 'palavra',
          description:
            'Escolha a palavra, para adicionar várias palavras use uma vírgula no meio (palavra,outrapalavra)',
          type: 'STRING',
          required: true,
        },
      ],
    },
  ],

  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    await interaction.deferReply()

    const { guild, options } = interaction

    const subCommand = options.getSubcommand()

    switch (subCommand) {
      case 'help':
        const embed = new MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setDescription(
            [
              '**Como eu adiciono ou removo uma palavra? da Lista Negra?**\nUsando o comando /filter [configurar] [adicionar ou remover]',
              '**Como eu limpo a Lista Negra por completo?**\nUse o comando /filter [clear]',
            ].join('\n')
          )

        interaction.editReply({ embeds: [embed] })
        break

      case 'clear':
        await schema.findOneAndUpdate({ guildId: guild.id }, { words: [] })
        client.filters.set(guild.id, [])
        interaction.editReply({
          content: 'Limpei a lista negra do filtro',
          ephemeral: true,
        })
        break

      case 'setar':
        const loggingChannel = options.getChannel('logging').id

        await schema.findOneAndUpdate(
          { guildId: guild.id },
          { log: loggingChannel },
          { new: true, upsert: true }
        )

        client.filtersLog.set(guild.id, loggingChannel)

        interaction.editReply({
          content: `Adicionei o canal <#${loggingChannel}> como o canal de logs do sistema de filtro`,
          ephemeral: true,
        })
        break

      case 'configurar':
        const choice = options.getString('options')
        const words = options.getString('palavra').toLowerCase().split(',')

        switch (choice) {
          case 'add':
            schema.findOne({ guildId: guild.id }, async (err, data) => {
              if (err) {
                throw err
              }

              if (!data) {
                await schema.create({
                  guildId: guild.id,
                  log: null,
                  words: words,
                })

                client.filters.set(guild.id, words)
                return interaction.editReply({
                  content: `Adicionei ${words.length} palavra(s) para a lista negra.`,
                  ephemeral: true,
                })
              }

              const newWords = []

              words.forEach((w) => {
                if (data.words.includes(w)) {
                  return
                }

                newWords.push(w)
                data.words.push(w)
                client.filters.get(guild.id).push(w)
              })

              interaction.editReply({
                content: `Adicionei ${newWords.length} palavra(s) para a lista negra.`,
                ephemeral: true,
              })

              data.save()
            })
            break

          case 'remove':
            schema.findOne({ guildId: guild.id }, async (err, data) => {
              try {
                if (err) {
                  throw err
                }

                if (!data) {
                  return interaction.editReply({
                    content: 'Não há nenhuma palavra para remover!',
                    ephemeral: true,
                  })
                }

                const removedWords = []

                words.forEach((w) => {
                  if (!data.words.includes(w)) {
                    return
                  }

                  data.words.remove(w)
                  removedWords.push(w)
                })

                const newArray = await client.filters
                  .get(guild.id)
                  .filter((word) => !removedWords.includes(word))

                client.filters.set(guild.id, newArray)

                interaction.editReply({
                  content: `Removi ${removedWords.length} palavra(s) da lista negra.`,
                  ephemeral: true,
                })

                data.save()
              } catch {
                interaction.editReply({
                  content: 'Esta palavra não está na lista!',
                })
              }
            })
            break
        }
        break
    }
  },
}
