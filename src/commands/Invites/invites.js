const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invites')
        .setDescription('Check invite stats')
        .addUserOption(option => option.setName('user').setDescription('The user to check').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const guildId = interaction.guild.id;

        const total = await db.get(`invites_${guildId}_${user.id}.total`) || 0;
        const leaves = await db.get(`invites_${guildId}_${user.id}.leaves`) || 0;
        const fake = await db.get(`invites_${guildId}_${user.id}.fake`) || 0;
        const bonus = await db.get(`invites_${guildId}_${user.id}.bonus`) || 0;

        const current = total + bonus - leaves - fake;

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Invites`)
            .setColor('Blue')
            .setDescription(`**${current}** Invites (**${total}** Regular, **${bonus}** Bonus, **${fake}** Fake, **${leaves}** Leaves)`);

        await interaction.reply({ embeds: [embed] });
    },
};
