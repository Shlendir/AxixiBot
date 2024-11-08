const { SlashCommandBuilder } = require("discord.js");
const balls = [
  "It is certain.",
  "It is decidedly so.",
  "Reply hazy try again.",
  "Cannot predict now.",
  "Do not count on it.",
  "My sources say no.",
  "Outlook not so good.",
  "Signs point to yes.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Get a random answer for your question.")
    .addStringOption((option) => option.setName("question").setDescription("Ask your question.").setRequired(false)),

  async execute(interaction, client) {
    await interaction.deferReply({ fetchReply: true });

    let question = interaction.options.getString("question");
    question = question ? `Question: "${question}"\n` : null;

    let randomIndex = Math.floor(Math.random() * 8);

    // output embed
    const embed = client.makeEmbed("EightBall.", question, 0xa1c1d9, [{ name: "Answer:", value: `> *${balls[randomIndex]}*` }]);
    await interaction.editReply({ embeds: [embed] });
  },
};
