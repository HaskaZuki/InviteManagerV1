const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-welcome')
        .setDescription('Configure welcome system')
        .addChannelOption(option => option.setName('channel').setDescription('Welcome channel').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Variables: {user}, {inviter}, {invite_count}, {member_count}').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');

        await db.set(`config_${interaction.guild.id}.welcomeChannel`, channel.id);
        if (message) {
            await db.set(`config_${interaction.guild.id}.welcomeMsg`, message);
        }

        await interaction.reply({ content: `Welcome channel set to ${channel}.`, ephemeral: true });
    },
};
