const { Events } = require('discord.js');
const inviteTracker = require('../utils/inviteTracker');
const db = require('../utils/db');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        await inviteTracker.handleLeave(member);

        const leaveChannelId = await db.get(`config_${member.guild.id}.leaveChannel`);
        if (leaveChannelId) {
            const channel = member.guild.channels.cache.get(leaveChannelId);
            if (channel) {
                let message = await db.get(`config_${member.guild.id}.leaveMsg`) || "{user} left the server.";
                
                message = message.replace(/{user}/g, member.user.tag)
                                 .replace(/{member_count}/g, member.guild.memberCount);
                
                channel.send(message);
            }
        }
    },
};
