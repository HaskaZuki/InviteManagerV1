const { Events, EmbedBuilder } = require('discord.js');
const inviteTracker = require('../utils/inviteTracker');
const db = require('../utils/db');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const inviterData = await inviteTracker.handleJoin(member);
        
        const welcomeChannelId = await db.get(`config_${member.guild.id}.welcomeChannel`);
        if (welcomeChannelId) {
            const channel = member.guild.channels.cache.get(welcomeChannelId);
            if (channel) {
                let message = await db.get(`config_${member.guild.id}.welcomeMsg`) || "Welcome {user} to the server! Invited by {inviter} ({invite_count} invites).";
                
                let inviterName = "Unknown";
                let inviteCount = "0";
                
                if (inviterData) {
                    const inviter = await member.client.users.fetch(inviterData.inviter.id);
                    inviterName = inviter.tag;
                    const total = await db.get(`invites_${member.guild.id}_${inviter.id}.total`) || 0;
                    inviteCount = total.toString();
                    
                    const roles = await db.get(`roles_${member.guild.id}`) || [];
                    const sortedRoles = roles.sort((a, b) => b.invites - a.invites);
                    for (const roleConfig of sortedRoles) {
                        if (total >= roleConfig.invites) {
                            const memberInviter = member.guild.members.cache.get(inviter.id);
                            if (memberInviter) {
                                memberInviter.roles.add(roleConfig.roleId).catch(console.error);
                            }
                            break;
                        }
                    }
                }

                message = message.replace(/{user}/g, member.toString())
                                 .replace(/{inviter}/g, inviterName)
                                 .replace(/{invite_count}/g, inviteCount)
                                 .replace(/{member_count}/g, member.guild.memberCount);

                channel.send(message);
            }
        }
    },
};
