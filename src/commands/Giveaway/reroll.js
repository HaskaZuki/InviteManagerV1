const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway-reroll')
        .setDescription('Reroll a giveaway winner')
        .addStringOption(option => option.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true)),
    async execute(interaction) {
        const messageId = interaction.options.getString('message_id');
        try {
            const message = await interaction.channel.messages.fetch(messageId);
            if (!message) return interaction.reply({ content: 'Message not found.', ephemeral: true });

            const reaction = message.reactions.cache.get('🎉');
            if (!reaction) return interaction.reply({ content: 'No reaction found.', ephemeral: true });

            const users = await reaction.users.fetch();
            const validUsers = users.filter(u => !u.bot);

            if (validUsers.size === 0) return interaction.reply({ content: 'No valid entries.', ephemeral: true });

            const winner = validUsers.random();
            await interaction.reply(`🎉 The new winner is ${winner}!`);
        } catch (error) {
            await interaction.reply({ content: 'Error rerolling.', ephemeral: true });
        }
    },
};
