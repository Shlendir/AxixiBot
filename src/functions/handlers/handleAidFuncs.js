const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  client.makeEmbed = (emTitle, emDesc, emHex, emFields) => {
    const embed = new EmbedBuilder()
      .setTitle(emTitle || null)
      .setDescription(emDesc || null)
      .setColor(emHex || 0x231333) //purple deafult color
      .addFields(emFields || []);

    return embed;
  };
};
