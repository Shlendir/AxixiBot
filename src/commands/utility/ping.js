const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong."),
  async execute(interaction, client) {
    const message = await interaction.deferReply({ fetchReply: true });

    const embed = new EmbedBuilder()
      .setTitle("*Pong.*")
      .setColor(0xaa182c)
      .addFields([
        {
          name: `API Latency`,
          value: `${client.ws.ping}`,
          inline: true,
        },
        {
          name: `Client Ping`,
          value: `${message.createdTimestamp - interaction.createdTimestamp}`,
          inline: true,
        },
      ]);

    await interaction.editReply({ embeds: [embed] });
  },
};
