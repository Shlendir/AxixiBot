const { SlashCommandBuilder } = require("discord.js");
const { currencyKey } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("currency")
    .setDescription("Convert currencies.")
    // "from" what currency option
    .addStringOption((option) =>
      option
        .setName("from")
        .setDescription("What currency do you have?")
        .setRequired(true)
        .addChoices(
          { name: "Euro", value: "EUR" },
          { name: "Dollar", value: "USD" },
          { name: "CanadianDollar", value: "CAD" },
          { name: "AustralianDollar", value: "AUD" },
          { name: "PoundSterling", value: "GBP" },
          { name: "Shekel", value: "ILS" },
          { name: "NorwegianKrone", value: "NOK" }
        )
    )
    // "amount" of the mons
    .addNumberOption((option) => option.setName("amount").setDescription("How much to convert?").setRequired(true).setMinValue(0))
    // "to" what currency
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("What currency to convert to?")
        .setRequired(true)
        .addChoices(
          { name: "Euro", value: "EUR" },
          { name: "Dollar", value: "USD" },
          { name: "CanadianDollar", value: "CAD" },
          { name: "AustralianDollar", value: "AUD" },
          { name: "PoundSterling", value: "GBP" },
          { name: "Shekel", value: "ILS" },
          { name: "NorwegianKrone", value: "NOK" }
        )
    ),

  async execute(interaction, client) {
    await interaction.deferReply({ fetchReply: true });
    const from = interaction.options.getString("from");
    const amount = interaction.options.getNumber("amount");
    const to = interaction.options.getString("to");
    let embed = null;

    if (from === to)
      // output embed if same currency
      embed = client.makeEmbed("Convert currencies.", `${amount} ${from}`, 0xa1c1d9);
    else {
      // the fetch and url with interact inputs
      let url = `https://v6.exchangerate-api.com/v6/${currencyKey}/pair/${from}/${to}/${amount}`;
      let request = await fetch(url);
      let res = await request.json();

      let result = res.conversion_result.toFixed(2); //makes sure its two places after the dot and no more

      // output embed
      embed = client.makeEmbed("Convert currencies.", `${amount} ${from} --> ${result} ${to}`, 0xa1c1d9);
    }
    await interaction.editReply({ embeds: [embed] });
  },
};
