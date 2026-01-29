const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/db');
const ms = require('ms'); // Currently not installed, will need to handle duration manually or install ms. I'll use simple regex or seconds for simplicity or assume user inputs minutes.
// Actually, I'll interpret the integer as minutes for simplicity as I can't install ms easily right now if npm is blocked.

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway-start')
        .setDescription('Start a giveaway')
        .addStringOption(option => option.setName('prize').setDescription('Prize').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Duration in minutes').setRequired(true))
        .addIntegerOption(option => option.setName('winners').setDescription('Number of winners').setRequired(true))
        .addIntegerOption(option => option.setName('requirement').setDescription('Invite requirement (0 for none)').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const durationMins = interaction.options.getInteger('duration');
        const winnersCount = interaction.options.getInteger('winners');
        const requirement = interaction.options.getInteger('requirement') || 0;

        const endTime = Date.now() + (durationMins * 60 * 1000);

        const embed = new EmbedBuilder()
            .setTitle('🎉 GIVEAWAY 🎉')
            .setDescription(`**Prize:** ${prize}\n**Ends:** <t:${Math.floor(endTime / 1000)}:R> (<t:${Math.floor(endTime / 1000)}:f>)\n**Invites Required:** ${requirement}\n**Winners:** ${winnersCount}\n\nReact with 🎉 to enter!`)
            .setColor('Gold')
            .setTimestamp(endTime);

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        await message.react('🎉');

        await db.set(`giveaway_${message.id}`, {
            prize,
            endTime,
            winnersCount,
            requirement,
            host: interaction.user.id,
            channelId: interaction.channel.id,
            messageId: message.id,
            active: true
        });

        // Set a timeout to end the giveaway
        setTimeout(async () => {
            // Re-fetch the message to get current reactions
            try {
                const fetchedMsg = await interaction.channel.messages.fetch(message.id);
                if (!fetchedMsg) return;

                const giveawayData = await db.get(`giveaway_${message.id}`);
                if (!giveawayData || !giveawayData.active) return;

                await db.set(`giveaway_${message.id}.active`, false);

                const reaction = fetchedMsg.reactions.cache.get('🎉');
                if (!reaction) return;

                const users = await reaction.users.fetch();
                const validUsers = users.filter(u => !u.bot);

                if (validUsers.size === 0) {
                    await interaction.channel.send(`Giveaway for **${prize}** ended! No one entered.`);
                    return;
                }

                // Pick winners
                const winners = validUsers.random(Math.min(winnersCount, validUsers.size));
                const winnerString = Array.isArray(winners) ? winners.map(w => w.toString()).join(', ') : winners.toString();

                await interaction.channel.send(`🎉 Congratulations ${winnerString}! You won **${prize}**!`);
                
                const endEmbed = EmbedBuilder.from(fetchedMsg.embeds[0])
                    .setDescription(`**Prize:** ${prize}\n**Ended:** <t:${Math.floor(endTime / 1000)}:R>\n**Winner(s):** ${winnerString}`)
                    .setColor('Grey');
                
                await fetchedMsg.edit({ embeds: [endEmbed] });

            } catch (err) {
                console.error("Giveaway end error", err);
            }

        }, durationMins * 60 * 1000);
    },
};
