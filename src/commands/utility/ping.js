const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong."),
  async execute(interaction, client) {
    const message = await interaction.deferReply({ fetchReply: true });

    const clientPing = `${message.createdTimestamp - interaction.createdTimestamp}`;
    const emFields = [
      { name: `API Latency`, value: `${client.ws.ping}`, inline: true },
      { name: `Client Ping`, value: clientPing, inline: true },
    ];

    // output embed
    const embed = client.makeEmbed("*Pong.*", null, 0xaa182c, emFields);
    await interaction.editReply({ embeds: [embed] });
  },
};
