require('dotenv').config();

module.exports = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID, 
    devGuildId: process.env.GUILD_ID, // Optional: Only for dev environment
};
