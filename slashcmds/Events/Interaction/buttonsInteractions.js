const { ButtonInteraction } = require("discord.js");

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {ButtonInteraction} interaction
     */

    execute(interaction, client) {
        if (!interaction.isButton()) {
            return
        }

        const button = client.buttons.get(interaction.customId)

        if (!button) {
            return
        }

        if (button.permission && !interaction.member.permissions.has(button.permission)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este botão', ephemeral: true })
        }

        if (button.ownerOnly && interaction.member.id !== interaction.guild.ownerId) {
            return interaction.reply('Somente o dono do servidor pode usar estes comandos')
        }

        button.execute(interaction, client)
    }
}