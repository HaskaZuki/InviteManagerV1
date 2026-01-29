const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-leave')
        .setDescription('Configure leave system')
        .addChannelOption(option => option.setName('channel').setDescription('Leave channel').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Variables: {user}, {member_count}').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');

        await db.set(`config_${interaction.guild.id}.leaveChannel`, channel.id);
        if (message) {
            await db.set(`config_${interaction.guild.id}.leaveMsg`, message);
        }

        await interaction.reply({ content: `Leave channel set to ${channel}.`, ephemeral: true });
    },
};
