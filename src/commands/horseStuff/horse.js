const { SlashCommandBuilder } = require("discord.js");
const baseCombos = require("../../functions/datafiles/horseColors.json");
const breeds = require("../../functions/datafiles/breeds.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("horse")
    .setDescription("Find foal information: base colors, crosses or height.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("color")
        .setDescription("Base color results.")
        .addStringOption((option) =>
          option
            .setName("firstcolor")
            .setDescription("First parent base color.")
            .setRequired(true)
            .addChoices(
              { name: "Black", value: "Black" },
              { name: "Bay", value: "Bay" },
              { name: "Seal Brown", value: "Seal Brown" },
              { name: "Smoky Black", value: "Smoky Black" },
              { name: "Chestnut", value: "Chestnut" },
              { name: "Liver", value: "Liver" },
              { name: "Sorrel", value: "Sorrel" },
              { name: "Brown", value: "Brown" },
              { name: "Buckskin", value: "Buckskin" },
              { name: "Palomino", value: "Palomino" },
              { name: "Cremello", value: "Cremello" },
              { name: "Perlino", value: "Perlino" },
              { name: "Dun", value: "Dun" },
              { name: "Red Dun", value: "Red Dun" },
              { name: "Champagne", value: "Champagne" },
              { name: "Silver Dapple", value: "Silver Dapple" },
              { name: "Ivory Champagne", value: "Ivory Champagne" },
              { name: "Mushroom", value: "Mushroom" },
              { name: "Pearl", value: "Pearl" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("secondcolor")
            .setDescription("Second parent base color.")
            .setRequired(true)
            .addChoices(
              { name: "Black", value: "Black" },
              { name: "Bay", value: "Bay" },
              { name: "Seal Brown", value: "Seal Brown" },
              { name: "Smoky Black", value: "Smoky Black" },
              { name: "Chestnut", value: "Chestnut" },
              { name: "Liver", value: "Liver" },
              { name: "Sorrel", value: "Sorrel" },
              { name: "Brown", value: "Brown" },
              { name: "Buckskin", value: "Buckskin" },
              { name: "Palomino", value: "Palomino" },
              { name: "Cremello", value: "Cremello" },
              { name: "Perlino", value: "Perlino" },
              { name: "Dun", value: "Dun" },
              { name: "Red Dun", value: "Red Dun" },
              { name: "Champagne", value: "Champagne" },
              { name: "Silver Dapple", value: "Silver Dapple" },
              { name: "Ivory Champagne", value: "Ivory Champagne" },
              { name: "Mushroom", value: "Mushroom" },
              { name: "Pearl", value: "Pearl" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("breed")
        .setDescription("ä")
        .addStringOption((option) =>
          option
            .setName("breed1")
            .setDescription("ö")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("breed2")
            .setDescription("ü")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
    async autocomplete(interaction, client) {
      const focusedValue = interaction.options.getFocused();
      var choices = breeds;
      var filtered = choices.filter((choice) => choice.name.toLowerCase().includes(focusedValue.toLowerCase()));
      const max = 5;
      filtered = filtered.length > max ? filtered.slice(0, max) : filtered;
      await interaction.respond(filtered);
    },

  async execute(interaction, client) {
    await interaction.deferReply({ fetchReply: true });

    switch (interaction.options.getSubcommand(false)) {
      // color subcommand
      case "color":
        const firstchoice = interaction.options.getString("firstcolor");
        const secondchoice = interaction.options.getString("secondcolor");
        let result = null;
        // loop to find the 4 results from base breeding
        for (const combo of baseCombos) {
          if (
            (combo.baseColor[0] === firstchoice && combo.baseColor[1] === secondchoice) ||
            (combo.baseColor[1] === firstchoice && combo.baseColor[0] === secondchoice)
          ) {
            result = combo.baseResult;
            break;
          }
        }
        if (result === null) return await interaction.editReply("How the fuck did you get this? Probs tag @ dev");

        let newMessage = `Bases: ${firstchoice} + ${secondchoice}\nResults: `;
        let sames = [];
        for (const color of result) {
          if (sames.includes(color)) continue;
          let count = result.filter((c) => c === color).length;
          newMessage += `${count * 25}% ${color}, `;
          sames.push(color);
        }
        newMessage = newMessage.slice(0, -2);
        return await interaction.editReply({ content: newMessage });

      // breed subcommand
      case "breed":
        return await interaction.editReply(`*[wip]*`);
      default:
        return await interaction.editReply("error message I'm so confused where am I");
    }
  },
};
