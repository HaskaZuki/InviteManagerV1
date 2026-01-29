# Discord Invite Manager

A complete and modular Discord bot focused on Invite Tracking and Giveaways, built with **Discord.js v14** and **Quick.db**.

## ✨ Key Features

### 📊 Invite Tracking System
- **Real-time Tracking**: Accurately detects who invites new members.
- **Invite Types**:
  - **Regular**: Genuine invites.
  - **Fake**: Accounts that are too young (less than 3 days) or join-leave spammers.
  - **Bonus**: Extra invites granted by admins.
  - **Leaves**: Count of people who were invited but later left the server.
- **Leaderboard**: Displays the top inviters in the server.

### 🎉 Giveaway System
- **Invite Requirements**: Set minimum invite requirements to join a giveaway.
- **Auto-Unreact**: The bot automatically removes reactions from users who don't meet the invite requirement and sends them a DM.
- **Commands**: Start, End (Manual), and Reroll winners.

### 👋 Welcome & Leave System
- **Custom Messages**: Configure your own messages with variables.
- **Variables**:
  - `{user}`: Mentions the new member.
  - `{inviter}`: The tag of the inviter.
  - `{invite_count}`: Total invites of the inviter.
  - `{member_count}`: Current server member count.
- **Auto-Roles**: Automatically assign roles when a user reaches a specific invite milestone (e.g., 5 Invites -> @Silver).

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: Version 16.9.0 or newer (v18+ recommended).
- **Build Tools** (Crucial for `quick.db`/`better-sqlite3`):
  - Windows: `npm install --global --production windows-build-tools` (Run PowerShell as Administrator).

### Steps

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/invite-manager-bot.git
    cd invite-manager-bot
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```
    *If you encounter errors with `better-sqlite3`, ensure you have installed the build tools mentioned above.*

3.  **Environment Configuration**
    Create a `.env` file (or rename `.env.example`) and fill in the following:
    ```env
    TOKEN=OTk5... (Your Bot Token from Discord Developer Portal)
    CLIENT_ID=123456789... (Bot Application ID)
    GUILD_ID=123456789... (Testing Guild ID, optional)
    ```

4.  **Start the Bot**
    ```bash
    npm start
    ```

---

## 🛠️ Commands List

### 🟢 General
| Command | Description |
| :--- | :--- |
| `/help` | Shows the help menu and command list. |
| `/ping` | Checks bot latency. |
| `/stats` | Shows bot statistics (Uptime, Memory, Servers). |

### 📨 Invites
| Command | Description |
| :--- | :--- |
| `/invites [user]` | Check invite statistics for yourself or others. |
| `/leaderboard` | Displays the Top 10 inviters in the server. |

### 🎁 Giveaway
| Command | Description | Permission |
| :--- | :--- | :--- |
| `/giveaway-start` | Start a giveaway (Input: Prize, Duration, Winners, Req). | `ManageGuild` |
| `/giveaway-end` | Manually end a giveaway (Input: Message ID). | `ManageGuild` |
| `/giveaway-reroll` | Reroll a giveaway winner (Input: Message ID). | `ManageGuild` |

### 🛡️ Admin & Config
| Command | Description | Permission |
| :--- | :--- | :--- |
| `/add-invite` | Add bonus invites to a user. | `Administrator` |
| `/remove-invite` | Remove bonus invites from a user. | `Administrator` |
| `/set-welcome` | Set the welcome channel and message. | `Administrator` |
| `/set-leave` | Set the leave channel and message. | `Administrator` |
| `/config-roles` | Add auto-role rewards (e.g., 5 inv -> @Role). | `Administrator` |

---

## ❓ Troubleshooting

**Q: Error `gyp` or `better-sqlite3` during install?**
A: The invite database uses SQLite which requires a C++ compiler.
Solution:
1. Install Visual Studio Build Tools.
2. Or run this administration command: `npm install --global --production windows-build-tools`.

**Q: Bot doesn't detect invites?**
A: Ensure the bot has `ManageServer` or `ManageGuild` permissions to view audit logs and invite codes.

**Q: Welcome message not appearing?**
A: Make sure the bot has permission to send messages in the configured channel and that the channel ID is correct.

---

## 📈 Scaling to Production (Sharding)

If your bot grows to over **2,500 guilds**, you will need to use **Discord Sharding**. This splits your bot's connection into multiple processes to handle the load.

To enable sharding, create a file named `sharder.js` in the root folder (where `package.json` is):

```javascript
// sharder.js
const { ShardingManager } = require('discord.js');
const config = require('./src/config');

const manager = new ShardingManager('./src/index.js', { 
    token: config.token,
    totalShards: 'auto', // Automatically calculate sharding needs
    respawn: true // Restart shard if it crashes
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();
```

Then, instead of running `node src/index.js`, you run:
```bash
node sharder.js
```

---
## 🛠 Support & Contact

If you encounter any issues or want to reach out directly, feel free to join our community or add me on Discord.

[![Discord Support](https://img.shields.io/badge/Discord-Support%20Server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/9RWJqdCg)
[![Discord](https://img.shields.io/badge/Discord-Contact%20Me-white?style=for-the-badge&logo=discord&logoColor=5865F2)](https://discord.com/users/710245394533318676)

> **Discord Username:** `zuki96_`

## 📝 License
This project is licensed under the **MIT License**.
Free to use, modify, and distribute.
