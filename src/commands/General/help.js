const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Help Menu')
            .setColor('#00FF00')
            .addFields(
                { name: 'General', value: '`/ping`, `/help`, `/stats`' },
                { name: 'Invites', value: '`/invites`, `/add-invite`, `/remove-invite`, `/leaderboard`' },
                { name: 'Giveaway', value: '`/giveaway-start`, `/giveaway-end`, `/giveaway-reroll`' },
                { name: 'Admin', value: '`/set-welcome`, `/set-leave`, `/config-roles`' }
            );

        await interaction.reply({ embeds: [embed] });
    },
};
