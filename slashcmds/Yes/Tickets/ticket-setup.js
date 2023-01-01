const {
  MessageEmbed,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} = require('discord.js')

const db = require('../../../schemas/ticket-setup')

module.exports = {
  name: 'ticketsetup',
  description: 'Configura sua mensagem de ticket',
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: 'canal',
      description: 'Selecione o canal de criação dos tickets',
      required: true,
      type: 'CHANNEL',
      channelTypes: ['GUILD_TEXT'],
    },
    {
      name: 'categoria',
      description:
        'Selecione a categoria onde os canais dos tickets serão criados',
      required: true,
      type: 'CHANNEL',
      channelTypes: ['GUILD_CATEGORY'],
    },
    {
      name: 'transcrições',
      description: 'Selecione o canal onde as transcrições serão mandadas',
      required: true,
      type: 'CHANNEL',
      channelTypes: ['GUILD_TEXT'],
    },
    {
      name: 'administradores',
      description:
        'Selecione o cargo de quem responderá e administrar os tickets',
      required: true,
      type: 'ROLE',
    },
    {
      name: 'everyone',
      description:
        'Marque o cargo @everyone ( Isto é uma parte importante do processo! )',
      required: true,
      type: 'ROLE',
    },
    {
      name: 'descrição',
      description:
        'Determine o texto que aparecerá na mensagem de criação dos tickets',
      required: true,
      type: 'STRING',
    },
    {
      name: 'primeiro-botão',
      description:
        'Dê um nome ao primeiro botão e adicione um emoji (Exemplo: Reportar Alguém,🎟)',
      required: true,
      type: 'STRING',
    },
    {
      name: 'segundo-botão',
      description:
        'Dê um nome ao segundo botão e adicione um emoji (Exemplo: Bug,🐞)',
      required: true,
      type: 'STRING',
    },
    {
      name: 'terceiro-botão',
      description:
        'Dê um nome ao terceiro botão e adicione um emoji (Exemplo: Denúncia,❌)',
      required: true,
      type: 'STRING',
    },
  ],

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const { guild, options } = interaction

    try {
      const channel = options.getChannel('canal')
      const category = options.getChannel('categoria')
      const transcripts = options.getChannel('transcrições')
      const handlers = options.getRole('administradores')
      const everyone = options.getRole('everyone')

      const description = options.getString('descrição')

      const button1 = options.getString('primeiro-botão').split(',')
      const button2 = options.getString('segundo-botão').split(',')
      const button3 = options.getString('terceiro-botão').split(',')

      const emoji1 = button1[1]
      const emoji2 = button2[1]
      const emoji3 = button3[1]

      await db.findOneAndUpdate(
        { guildId: guild.id },
        {
          channel: channel.id,
          category: category.id,
          transcripts: transcripts.id,
          handlers: handlers.id,
          everyone: everyone.id,
          description: description,
          buttons: [button1[0], button2[0], button3[0]],
        },
        {
          new: true,
          upsert: true,
        }
      )

      const buttons = new MessageActionRow()
      buttons.addComponents(
        new MessageButton()
          .setCustomId(button1[0])
          .setLabel(button1[0])
          .setStyle('PRIMARY')
          .setEmoji(emoji1),
        new MessageButton()
          .setCustomId(button2[0])
          .setLabel(button2[0])
          .setStyle('SECONDARY')
          .setEmoji(emoji2),
        new MessageButton()
          .setCustomId(button3[0])
          .setLabel(button3[0])
          .setStyle('SUCCESS')
          .setEmoji(emoji3)
      )

      const embed = new MessageEmbed()
        .setAuthor({
          name: guild.name + ' | Sistema de Tickets',
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setDescription(description)
        .setColor(process.env.EMBED_COLOR)

      await guild.channels.cache
        .get(channel.id)
        .send({ embeds: [embed], components: [buttons] })

      interaction.reply({ content: 'Pronto', ephemeral: true })
    } catch (err) {
      const errorEmbed = new MessageEmbed().setColor('RED')
        .setDescription(`⛔ | Um erro ocorreu configurando seu sistema de tickets\n**oque fazer?**
      1. Certifique se o nome de algum de seus botões está duplicado
      2. Certifique de usar este padrão em seus botões: **Nome,Emoji**
      3. Certifique se o nome dos seus botões não ultrapassa 200 caracteres
      4. Certifique que os emojis dos seus botões são emojis, não ids`)

      interaction.reply({ embeds: [errorEmbed] })
    }
  },
}
