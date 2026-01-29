const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-invite')
        .setDescription('Remove bonus invites from a user')
        .addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('Amount to remove').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        
        await db.sub(`invites_${interaction.guild.id}_${user.id}.bonus`, amount);
        
        await interaction.reply({ content: `Removed ${amount} bonus invites from ${user.tag}.`, ephemeral: true });
    },
};
