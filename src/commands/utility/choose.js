const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("choose")
    .setDescription("Let the bot choose for you.")
    .addStringOption((option) => option.setName("choices").setDescription('Separate choices with ","').setRequired(true))
    .addStringOption((option) => option.setName("context").setDescription("Add context to the choices.").setRequired(false)),

  async execute(interaction, client) {
    await interaction.deferReply({ fetchReply: true });
    let context = interaction.options.getString("context");
    let newMessage = "";
    if (context) newMessage = `Context: "${context}"\n`;

    let choices = interaction.options.getString("choices");
    if (!choices.includes(","))
      return await interaction.editReply({ content: "Error: you need more than one choice to choose from." });
    choices = choices.replaceAll(", ", ",").replaceAll(" ,", ",");
    choices = choices.split(",");

    let randomIndex = Math.floor(Math.random() * choices.length);
    newMessage += `> *${choices[randomIndex]}*`;

    await interaction.editReply({ content: newMessage });
  },
};
