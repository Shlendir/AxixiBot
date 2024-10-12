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

    const unit1 = interaction.options.getString("unit"); //celcius etc
    const first_temp = interaction.options.getNumber("temp"); //the number they gave
    const unit2 = interaction.options.getString("to"); //whatever the fuck they want to convert to
    let last_temp = 0; //what it results to
    let newMessage = "";

    // if ppl chose the same damn units
    if (unit1 === unit2) newMessage = `${first_temp}°${unit1}`;
    else {
      if (unit1 === "C") {
        if (unit2 === "F") last_temp = first_temp * (9 / 5) + 32; // c to f
        else if (unit2 === "K") last_temp = first_temp + 273.15; // c to k
      } else if (unit1 === "F") {
        if (unit2 === "C") last_temp = (first_temp - 32) / (9 / 5); // f to c
        else if (unit2 === "K") last_temp = (first_temp + 459.67) * (5 / 9); // f to k
      } else if (unit1 === "K") {
        if (unit2 === "C") last_temp = first_temp - 273.15; // k to c
        else if (unit2 === "F") last_temp = first_temp * (9 / 5) - 459.67; // k to f
      }

      const rounded = last_temp.toFixed(2); //rounds it 

      newMessage = `${first_temp}°${unit1} equals to ${rounded}°${unit2}`; //result message
    }
    await interaction.editReply({ content: newMessage });
  },
};
