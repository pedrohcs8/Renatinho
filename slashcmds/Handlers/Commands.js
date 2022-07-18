const { Perms } = require('../Validation/permissions')
const { Client } = require('discord.js')
const { promisify } = require('util')
const { glob } = require('glob')
const PG = promisify(glob)
const Ascii = require('ascii-table')

/**
 * @param {Client} client
 */

module.exports = async (client, PG, Ascii) => {
  const Table = new Ascii('Comando Carregado')

  let CommandsArray = []
  ;(await PG(`${process.cwd()}/slashcmds/Commands/*/*.js`)).map(
    async (file) => {
      const command = require(file)

      if (!command.name) {
        return Table.addRow(
          file.split('/'[7], '🛑 - Erro', 'Faltando um nome.')
        )
      }

      if (!command.context && !command.description) {
        return Table.addRow(command.name, '🛑 - Erro', 'Falta a descrição')
      }

      if (command.permission) {
        if (Perms.includes(command.permission))
          command.defaultPermission = false
        else
          return Table.addRow(command.name, '🔶 FAILED', 'Invalid Permission.')
      }

      client.slashcommands.set(command.name, command)
      CommandsArray.push(command)

      await Table.addRow(command.name, '✅ - Sucesso')
    }
  )

  console.log(Table.toString())

  client.on('ready', async () => {
    client.guilds.cache.forEach((guild) => {
      guild.commands.set(CommandsArray).then(async (command) => {
        const Roles = (commandName) => {
          const cmdPerms = CommandsArray.find(
            (c) => c.name === commandName
          ).permission
          if (!cmdPerms) {
            return null
          }

          return guild.roles.cache
            .filter((r) => r.permissions.has(cmdPerms) && !r.managed)
            .first(10)
        }


      })
    })
  })

  client.on('guildCreate', async () => {
    client.guilds.cache.forEach((guild) => {
      guild.commands.set(CommandsArray).then(async (command) => {
        const Roles = (commandName) => {
          const cmdPerms = CommandsArray.find(
            (c) => c.name === commandName
          ).permission
          if (!cmdPerms) {
            return null
          }

          return guild.roles.cache
            .filter((r) => r.permissions.has(cmdPerms) && !r.managed)
            .first(10)
        }


      })
    })
  })
}
