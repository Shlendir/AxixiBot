const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("temp")
    .setDescription("Convert temperatures.")
    .addStringOption(
      (option) =>
        option
          .setName("unit")
          .setDescription("What unit do you have?")
          .setRequired(true)
          .addChoices({ name: "Celsius", value: "C" }, { name: "Fahrenheit", value: "F" }, { name: "Kelvin", value: "K" })
      //old values for fun: logical_temp, freedom_temp and chaos_temp lol
    )
    .addNumberOption((option) => option.setName("temp").setDescription("What is your temperature?").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("What unit to convert to?")
        .setRequired(true)
        .addChoices({ name: "Celsius", value: "C" }, { name: "Fahrenheit", value: "F" }, { name: "Kelvin", value: "K" })
    ),
  async execute(interaction, client) {
    await interaction.deferReply({ fetchReply: true });

    const unit1 = interaction.options.getString("unit");
    const first_temp = interaction.options.getNumber("temp");
    const unit2 = interaction.options.getString("to");
    let last_temp = "";
    let newMessage = "";

    // if ppl chose the same damn units
    if (unit1 === unit2) newMessage = `${first_temp}°${unit1}`;
    else {
      if (unit1 === "C") {
        // c to f, then c to k
        if (unit2 === "F") last_temp = first_temp * (9 / 5) + 32;
        else if (unit2 === "K") last_temp = first_temp + 273.15;
      } else if (unit1 === "F") {
        // f to c, then f to k
        if (unit2 === "C") last_temp = (first_temp - 32) / (9 / 5);
        else if (unit2 === "K") last_temp = (first_temp + 459.67) * (5 / 9);
      } else if (unit1 === "K") {
        // k to c, then k to f
        if (unit2 === "C") last_temp = first_temp - 273.15;
        else if (unit2 === "F") last_temp = first_temp * (9 / 5) - 459.67;
      }
      last_temp = Math.floor(last_temp);
      newMessage = `${first_temp}°${unit1} equals to ${last_temp}°${unit2}`;
    }
    await interaction.editReply({ content: newMessage });
  },
};
