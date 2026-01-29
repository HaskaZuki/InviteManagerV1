const { Events } = require('discord.js');
const db = require('../utils/db');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (user.bot) return;
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        const giveaway = await db.get(`giveaway_${reaction.message.id}`);
        if (!giveaway) return;

        if (giveaway.requirement > 0) {
            const invites = await db.get(`invites_${reaction.message.guild.id}_${user.id}.total`) || 0;
            const leaves = await db.get(`invites_${reaction.message.guild.id}_${user.id}.leaves`) || 0;
            const fake = await db.get(`invites_${reaction.message.guild.id}_${user.id}.fake`) || 0;
            const bonus = await db.get(`invites_${reaction.message.guild.id}_${user.id}.bonus`) || 0;

            const currentInvites = invites + bonus - leaves - fake;

            if (currentInvites < giveaway.requirement) {
                await reaction.users.remove(user.id);
                try {
                    await user.send(`You need ${giveaway.requirement} invites to join this giveaway. You currently have ${currentInvites}.`);
                } catch (err) {
                   
                }
            }
        }
    },
};
