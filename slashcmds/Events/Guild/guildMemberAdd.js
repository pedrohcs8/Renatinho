const {
  GuildMember,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  Client,
} = require('discord.js')
const moment = require('moment')

const guildSchema = require('../../../schemas/guild-schema')

function traduzir(number) {
  number = number.toString()
  var texto = ``,
    numbers = {
      0: '0️⃣',
      1: '1️⃣',
      2: '2️⃣',
      3: '3️⃣',
      4: '4️⃣',
      5: '5️⃣',
      6: '6️⃣',
      7: '7️⃣',
      8: '8️⃣',
      0: '0️⃣',
    }
  for (let i = 0; i < number.length; i++)
    texto += '' + numbers[parseInt(number[i])] + ''
  return texto
}

module.exports = {
  name: 'guildMemberAdd',

  /**
   *
   * @param {GuildMember} member
   * @param {Client} client
   */

  async execute(member, client) {
    try {
      console.log(
        `${member.user.tag} (${member.id}) entrou no server ${member.guild.name}`
      )

      const { user, guild } = member

      const doc = await guildSchema.findOne({ idS: guild.id })

      if (doc.welcome.status) {
        const welcomeChannelId = doc.welcome.channel
        const message = doc.welcome.msg
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId)

        const welcomeMessage = message
          .replace(/{member}/g, `<@${member.id}>`)
          .replace(/{name}/g, `${member.user.username}`)
          .replace(/{total}/g, guild.memberCount)
          .replace(/{guildName}/g, guild.name)

        welcomeChannel.send({ content: welcomeMessage })
      }

      // -------------

      //SISTEMA DE AUTOROLE

      if (doc.autorole.status) {
        member.roles.add(doc.autorole.roles, 'Sistema de AutoRole')
      }

      // -------------

      // SISTEMA DE LOG DE MEMBROS

      if (doc.logs.status) {
        const logChannel = (await member.guild.channels.fetch()).get(
          doc.logs.channel
        )

        if (!logChannel) {
          return
        }

        let color = '#74e21e'
        let risk = 'Relativamente Seguro'

        const accountCreation = parseInt(member.user.createdTimestamp / 1000)
        const joiningTime = parseInt(member.joinedAt / 1000)

        const monthsAgo = moment().subtract(2, 'months').unix()
        const weeksAgo = moment().subtract(2, 'weeks').unix()
        const daysAgo = moment().subtract(2, 'days').unix()

        if (accountCreation >= monthsAgo) {
          color = '#e2bb1e'
          risk = 'Médio'
        }

        if (accountCreation >= weeksAgo) {
          color = '#e24d1e'
          risk = 'Alto'
        }

        if (accountCreation >= daysAgo) {
          color = '#e21e1e'
          risk = 'Extremo'
        }

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `${member.user.tag} | ${member.id}`,
            iconURL: member.displayAvatarURL({ dynamic: true }),
          })
          .setColor(color)
          .setThumbnail(
            member.user.displayAvatarURL({ dynamic: true, size: 256 })
          )
          .setDescription(
            [
              `• Usuário: ${member.user}`,
              `• Tipo de conta: ${member.user.bot ? 'Bot' : 'Usuário'}`,
              `• Cargo(s) colocado(s): ${
                doc.autorole.roles.length > 0
                  ? doc.autorole.roles.join(', ')
                  : 'Nenhum'
              }`,
              `• Nível de rico: ${risk}\n`,
              `• Conta criada em: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
              `• Membro entrou no servidor em: <t:${joiningTime}:D> | <t:${joiningTime}:R>`,
            ].join('\n')
          )
          .setFooter({ text: 'O membro entrou no servidor' })
          .setTimestamp()

        if (risk == 'Extremo' || risk == 'Alto') {
          const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`MemberLogging-Kick-${member.id}`)
              .setLabel('Kick')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(`MemberLogging-Ban-${member.id}`)
              .setLabel('Ban')
              .setStyle(ButtonStyle.Danger)
          )

          return logChannel.send({ embeds: [embed], components: [buttons] })
        } else return logChannel.send({ embeds: [embed] })
      }

      // -------------

      // Sistema de Anti-Fake

      //TODO: IMPLEMENTAR O SISTEMA DE ANTIFAKE
      if (doc.antifake.status) {
        const timeAccount = moment(new Date()).diff(
          member.user.createdAt,
          'days'
        )

        const minimumDays = server.antifake.days

        if (timeAccount < minimumDays) {
          await member
            .kick(`Membro Kickado pelo Sistema de AntiFake`)
            .catch(() => {})
        }
      }

      // --------------

      //Sistema de Mensagem de Boas VINDAS

      //TODO: IMPLEMENTAR O SISTEMA DE MENSAGEM DE BOAS VINDAS
      if (doc.welcome.status) {
        this.client.channels.cache.get(doc.welcome.channel).send(
          doc.welcome.msg
            .replace(/{member}/g, `<@${member.id}>`)
            .replace(/{name}/g, `${member.user.username}`)
            .replace(/{total}/g, guild.memberCount)
            .replace(/{guildName}/g, guild.name)
        )
      }

      // --------------

      // TODO: IMPLEMENTAR O SISTEMA DE MOSTRADOR DE NÚMERO DE MEMBROS NO NOME DO CANAL
      if (doc.serverstats.status) {
        const st = doc.serverstats
        const ch = st.channels

        if (ch.total != 'null') {
          let channel = guild.channels.cache.get(ch.total)

          channel.setName(`Total: ${guild.memberCount.toLocaleString()}`)
        }

        if (ch.bot != 'null') {
          let channel = guild.channels.cache.get(ch.bot)

          channel.setName(
            `Bots: ${guild.members.cache
              .filter((x) => x.user.bot)
              .size.toLocaleString()}`
          )
        }

        if (ch.users != 'null') {
          let channel = guild.channels.cache.get(ch.users)

          channel.setName(
            `Usuários: ${guild.members.cache
              .filter((x) => !x.user.bot)
              .size.toLocaleString()}`
          )
        }
      }

      // TODO: IMPLEMENTAR SISTEMA DE CONTADOR DE MEMBROS COM EMOJI NA DESCRIÇÃO DO CANAL
      if (doc.contador.status) {
        this.client.channels.cache
          .get(doc.contador.channel)
          .setTopic(
            doc.contador.msg.replace(/{contador}/g, traduzir(guild.memberCount))
          )
      }
    } catch (err) {
      if (err) console.log(`(ERRO) - guildMemberAdd - ${err}`)
    }
  },
}
