const Command = require('@structures/Command')
const Emojis = require('@util/Emojis')
const guildSchema = require('@schemas/guild-schema')
const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = class Set extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'set'
    this.category = 'Config'
    this.description = 'Comando para setar o canal de formar calls privadas'
    this.usage = 'createcall set <id do canal>'
    this.aliases = ['setar']
    this.reference = 'createCall'

    this.enabled = true
    this.isSub = true
  }

  async run({ message, args, prefix, author }) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      message.reply(
        `${Emojis.Errado} | ${message.author}, você não tem permissão para usar esse comando`,
      )
      return
    }

    const doc = await guildSchema.findOne({ idS: message.guild.id })

    const channel =
      message.guild.channels.cache.get(args[1]) ||
      message.guild.channels.cache.find(
        (x) => x.name.toLowerCase() === args[1].toLowerCase(),
      )

    if (!channel) {
      message.reply(
        `${Emojis.Errado} | ${message.author} canal de voz não encontrado`,
      )
      return
    }

    if (channel.type != 'GUILD_VOICE') {
      message.reply(
        `${Emojis.Errado} | ${message.author} o canal deve ser de voz`,
      )
      return
    }

    if (!channel.parentId) {
      message.reply(
        `${Emojis.Errado} | ${message.author} o canal deve estar em uma categoria`,
      )
      return
    }

    if (channel.id == doc.createCall.channel) {
      message.reply(
        `${Emojis.Errado} | ${message.author} este canal é igual ao atual`,
      )
      return
    }

    let row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('yes')
        .setLabel('Sim')
        .setStyle('SUCCESS')
        .setDisabled(false),

      new MessageButton()
        .setCustomId('no')
        .setLabel('Não')
        .setStyle('DANGER')
        .setDisabled(false),
    )

    const changeChannel = async () => {
      await guildSchema.findOneAndUpdate(
        {
          idS: message.guild.id,
        },
        {
          $set: {
            'createCall.category': channel.parentId,
            'createCall.status': true,
            'createCall.channel': channel.id,
          },
        },
      )
    }

    if (doc.createCall.channel != 'null') {
      const msg = await message.reply({
        content: `${Emojis.Help} | ${message.author}, você deseja mudar o canal atual para **${channel.name}**?`,
        components: [row],
      })

      const filter = (interaction) => {
        return interaction.isButton() && interaction.message.id === msg.id
      }

      const collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 5000,
      })

      collector.on('end', async (r, reason) => {
        if (reason != 'time') {
          return
        }

        msg.delete()
      })

      collector.on('collect', async (x) => {
        if (x.user.id != message.author.id) {
          return x.reply({
            content: `${x.user}, você não pode usar estes botões.`,
            ephemeral: true,
          })
        }

        switch (x.customId) {
          case 'yes':
            message.reply(
              `${Emojis.Certo} | ${message.author}, canal alterado com sucesso.`,
            )
            await changeChannel()
            msg.delete()
            break

          case 'no':
            msg.delete()

            return message.reply('Ação cancelada com sucesso.')
            break
        }
      })
      return
    }

    message.reply(
      `${Emojis.Certo} | ${message.author}, canal alterado com sucesso.`,
    )
    await changeChannel()
  }
}
