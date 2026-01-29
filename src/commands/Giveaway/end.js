const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway-end')
        .setDescription('End a giveaway manually')
        .addStringOption(option => option.setName('message_id').setDescription('Message ID').setRequired(true)),
    async execute(interaction) {
        const messageId = interaction.options.getString('message_id');
        const giveaway = await db.get(`giveaway_${messageId}`);

        if (!giveaway || !giveaway.active) {
            return interaction.reply({ content: 'Giveaway not found or already ended.', ephemeral: true });
        }

        // We can't easily force the timeout to run immediately, but we can set active to false
        // and trigger the logic. However, the timeout logic in start.js is self-contained.
        // For a proper system, we'd need a giveaway manager that checks intervals.
        // For this simple version, we'll mark it inactive and pick a winner here.

        await db.set(`giveaway_${messageId}.active`, false);

        try {
            const message = await interaction.channel.messages.fetch(messageId);
            const reaction = message.reactions.cache.get('🎉');
            const users = await reaction.users.fetch();
            const validUsers = users.filter(u => !u.bot);

            if (validUsers.size === 0) {
                 await interaction.reply('Giveaway ended. No participants.');
                 return;
            }

            const winners = validUsers.random(Math.min(giveaway.winnersCount, validUsers.size));
            const winnerString = Array.isArray(winners) ? winners.map(w => w.toString()).join(', ') : winners.toString();

            await interaction.reply(`🎉 Giveaway ended manually! Winner(s): ${winnerString}`);
        } catch (err) {
            await interaction.reply({ content: 'Error ending giveaway.', ephemeral: true });
        }
    },
};
