const { REST } = require(`@discordjs/rest`);
const { Routes } = require(`discord-api-types/v9`);
const { token, boss } = process.env;

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await loadCommands(client);
    console.log(`Ready!! ${client.user.tag} is logged in and online.`);
    console.timeEnd("launch");
  },
};

async function loadCommands(client) {
  const rest = new REST({ version: "9" }).setToken(token);
  try {
    const guilds = Array.from(client.guilds.cache.values());
    console.log(
      `Started refreshing application (/) commands. ${client.commandArray.length} commands, ${guilds.length} guilds.`
    );
    let count = 0;
    for (const guild of guilds) {
      if (guild.members.cache.has(boss)) {
        await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), {
          body: client.commandArray,
        });
        count++;
      } else {
        await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), {
          body: [],
        });
        
      }
      console.log(guild.name);
    }
    console.log(
      `Successfully reloaded application (/) commands. ${client.commandArray.length} commands, ${count} guilds loaded.`
    );
  } catch (error) {
    console.error(error);
  }
}
