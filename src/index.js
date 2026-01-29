const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const config = require('./config');
const inviteTracker = require('./utils/inviteTracker');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent 
    ]
});

client.commands = new Collection();

const init = async () => {
    const commandFolders = readdirSync('./src/commands');
    for (const folder of commandFolders) {
        const commandFiles = readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
            client.commands.set(command.data.name, command);
        }
    }

    const eventFiles = readdirSync('./src/events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }

    await client.login(config.token);
};

init();
