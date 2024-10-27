console.time("launch");
require("dotenv").config();
const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { Guilds, GuildMembers, GuildPresences } = GatewayIntentBits

const client = new Client({
    presence: { activities: [{ name: "being gay", type: 5 }], status: "online" },
    intents: [Guilds, GuildMembers, GuildPresences]
});
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter(file => file.endsWith(".js"));
    for (const file of functionFiles)
        require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token);