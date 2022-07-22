const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: 'testbuttons',
    description: 'sla',
    execute(interaction) {
        const row = new MessageActionRow();
        row.addComponents(

            new MessageButton()
                .setCustomId('Hello')
                .setLabel('Hello')
                .setStyle('DANGER'),

            new MessageButton()
                .setCustomId('Bye')
                .setLabel('Bye')
                .setStyle('DANGER')
        )

        interaction.reply({ components: [row] })
    }
}