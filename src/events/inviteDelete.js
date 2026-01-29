const { Events, Collection } = require('discord.js');
const inviteTracker = require('../utils/inviteTracker');

module.exports = {
    name: Events.InviteDelete,
    async execute(invite) {
        const invites = await invite.guild.invites.fetch();
        inviteTracker.inviteCache.set(invite.guild.id, new Collection(invites.map(inv => [inv.code, inv.uses])));
    },
};
