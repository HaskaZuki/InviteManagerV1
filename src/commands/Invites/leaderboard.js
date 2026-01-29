const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show invite leaderboard'),
    async execute(interaction) {
        // Limitation: Quick.db isn't great for sorting all keys globally without a specific structure.
        // We'll iterate user keys for this guild. This is inefficient for large scales but fine for simple bots.
        const allData = await db.all();
        const guildId = interaction.guild.id;
        
        let lb = [];
        

        const prefix = `invites_${guildId}_`;
        
      
        const guildInvites = allData.filter(data => data.id.startsWith(prefix) && data.id.endsWith('.total'));
        
  
        
        const members = await interaction.guild.members.fetch();
        for (const [id, member] of members) {
            if (member.user.bot) continue;
            const total = await db.get(`invites_${guildId}_${id}.total`) || 0;
            const leaves = await db.get(`invites_${guildId}_${id}.leaves`) || 0;
            const fake = await db.get(`invites_${guildId}_${id}.fake`) || 0;
            const bonus = await db.get(`invites_${guildId}_${id}.bonus`) || 0;
            
            const current = total + bonus - leaves - fake;
            if (current > 0) {
                lb.push({ tag: member.user.tag, count: current });
            }
        }
        
        lb.sort((a, b) => b.count - a.count);
        lb = lb.slice(0, 10);
        
        if (lb.length === 0) {
            return interaction.reply('No invites found yet.');
        }
        
        const description = lb.map((u, i) => `${i + 1}. **${u.tag}** - ${u.count} invites`).join('\n');
        
        const embed = new EmbedBuilder()
            .setTitle('Invite Leaderboard')
            .setDescription(description)
            .setColor('Gold');

        await interaction.reply({ embeds: [embed] });
    },
};
