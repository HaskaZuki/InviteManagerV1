const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-invite')
        .setDescription('Add bonus invites to a user')
        .addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('Amount to add').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        
        await db.add(`invites_${interaction.guild.id}_${user.id}.bonus`, amount);
        
        await interaction.reply({ content: `Added ${amount} bonus invites to ${user.tag}.`, ephemeral: true });
    },
};
