const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows bot statistics'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Bot Statistics')
            .addFields(
                { name: 'Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: 'Users', value: `${interaction.client.users.cache.size}`, inline: true },
                { name: 'Node.js', value: `${process.version}`, inline: true },
                { name: 'Discord.js', value: `v${version}`, inline: true },
                { name: 'Uptime', value: `${Math.round(process.uptime() / 60)} minutes`, inline: true }
            )
            .setColor('Green');

        await interaction.reply({ embeds: [embed] });
    },
};
