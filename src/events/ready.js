const { Events, ActivityType, EmbedBuilder } = require('discord.js');
const inviteTracker = require('../utils/inviteTracker');
const db = require('../utils/db');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        await inviteTracker.init(client);
        
        client.user.setActivity('Invites & Giveaways', { type: ActivityType.Watching });

        // --- Resume Giveaways Logic ---
        const allData = await db.all();
        // db.all() structure depends on the driver, usually for quick.db (latest) it returns an array of { id, value }
        // We filter keys that start with "giveaway_"
        
        const giveawayKeys = allData.filter(d => d.id.startsWith('giveaway_'));

        for (const data of giveawayKeys) {
            const giveaway = data.value;
            if (!giveaway.active) continue;

            const now = Date.now();
            if (now >= giveaway.endTime) {
                // Should have ended already
                endGiveaway(client, giveaway);
            } else {
                // Still running, set timeout
                const timeRemaining = giveaway.endTime - now;
                setTimeout(() => endGiveaway(client, giveaway), timeRemaining);
            }
        }
        // -----------------------------

        const { REST, Routes } = require('discord.js');
        const rest = new REST({ version: '10' }).setToken(client.token);
        const commands = client.commands.map(c => c.data.toJSON());

        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    },
};

async function endGiveaway(client, giveawayData) {
    try {
        const channel = client.channels.cache.get(giveawayData.channelId);
        if (!channel) return;

        const message = await channel.messages.fetch(giveawayData.messageId).catch(() => null);
        if (!message) return;

        // Double check active status just in case
        const currentData = await db.get(`giveaway_${giveawayData.messageId}`);
        if (!currentData || !currentData.active) return;

        await db.set(`giveaway_${giveawayData.messageId}.active`, false);

        const reaction = message.reactions.cache.get('🎉');
        if (!reaction) return;

        const users = await reaction.users.fetch();
        const validUsers = users.filter(u => !u.bot);

        if (validUsers.size === 0) {
            await channel.send(`Giveaway for **${giveawayData.prize}** ended! No one entered.`);
            return;
        }

        const winnersCount = giveawayData.winnersCount || 1;
        const winners = validUsers.random(Math.min(winnersCount, validUsers.size));
        const winnerString = Array.isArray(winners) ? winners.map(w => w.toString()).join(', ') : winners.toString();

        await channel.send(`🎉 Congratulations ${winnerString}! You won **${giveawayData.prize}**!`);
        
        const endEmbed = EmbedBuilder.from(message.embeds[0])
            .setDescription(`**Prize:** ${giveawayData.prize}\n**Ended:** <t:${Math.floor(giveawayData.endTime / 1000)}:R>\n**Winner(s):** ${winnerString}`)
            .setColor('Grey');
        
        await message.edit({ embeds: [endEmbed] });

    } catch (err) {
        console.error(`Failed to end giveaway ${giveawayData.messageId}:`, err);
    }
}
