const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config-roles')
        .setDescription('Add an auto-role for invites')
        .addRoleOption(option => option.setName('role').setDescription('Role to give').setRequired(true))
        .addIntegerOption(option => option.setName('invites').setDescription('Invites required').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const invites = interaction.options.getInteger('invites');

        await db.push(`roles_${interaction.guild.id}`, { roleId: role.id, invites: invites });

        await interaction.reply({ content: `Added auto-role ${role} for ${invites} invites.`, ephemeral: true });
    },
};
