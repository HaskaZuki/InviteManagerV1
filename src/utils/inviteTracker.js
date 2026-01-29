const { Collection } = require('discord.js');
const db = require('./db');

const inviteCache = new Collection();

async function init(client) {
    for (const [id, guild] of client.guilds.cache) {
        try {
            const invites = await guild.invites.fetch();
            inviteCache.set(id, new Collection(invites.map(invite => [invite.code, invite.uses])));
        } catch (err) {
            console.error(`Failed to fetch invites for guild ${guild.id}`);
        }
    }
}

async function handleJoin(member) {
    const guildInvites = inviteCache.get(member.guild.id);
    if (!guildInvites) return;

    try {
        const newInvites = await member.guild.invites.fetch();
        const usedInvite = newInvites.find(inv => {
            const cachedUses = guildInvites.get(inv.code) || 0;
            return inv.uses > cachedUses;
        });

        if (usedInvite) {
            const inviterId = usedInvite.inviter.id;
            await db.add(`invites_${member.guild.id}_${inviterId}.total`, 1);
            await db.push(`invites_${member.guild.id}_${inviterId}.joined`, member.id);
            await db.set(`inviter_${member.guild.id}_${member.id}`, inviterId);

            inviteCache.set(member.guild.id, new Collection(newInvites.map(inv => [inv.code, inv.uses])));
            
            return usedInvite;
        } else {
             inviteCache.set(member.guild.id, new Collection(newInvites.map(inv => [inv.code, inv.uses])));
        }

    } catch (err) {
        console.error(err);
    }
}

async function handleLeave(member) {
    const inviterId = await db.get(`inviter_${member.guild.id}_${member.id}`);
    if (inviterId) {
        await db.add(`invites_${member.guild.id}_${inviterId}.leaves`, 1);
    }
}

module.exports = { init, handleJoin, handleLeave, inviteCache };
