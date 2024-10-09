const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Get a random answer for your question.")
    .addStringOption((option) => option.setName("question").setDescription("Ask your question.").setRequired(false)),

  async execute(interaction, client) {
    await interaction.deferReply({ fetchReply: true });

    let randomNumber = Math.floor(Math.random() * 8);
   /// unfinished
  }

};
