const { SlashCommandBuilder } = require("discord.js");
const baseCombos = require("../../functions/datafiles/horseColors.json");
const breeds = require("../../functions/datafiles/breeds.json");
const horseCross = require("../../functions/datafiles/horseCross.json");

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
            .setName("color1")
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
            .setName("color2")
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
        .addStringOption((option) => option.setName("breed1").setDescription("ö").setRequired(true).setAutocomplete(true))
        .addStringOption((option) => option.setName("breed2").setDescription("ü").setRequired(true).setAutocomplete(true))
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
    let result = null;

    switch (interaction.options.getSubcommand(false)) {
      // color subcommand
      case "color":
        const firstChoice = interaction.options.getString("color1");
        const secondChoice = interaction.options.getString("color2");
        // loop to find the 4 results from base breeding
        for (const combo of baseCombos) {
          if (
            (combo.baseColor[0] === firstChoice && combo.baseColor[1] === secondChoice) ||
            (combo.baseColor[1] === firstChoice && combo.baseColor[0] === secondChoice)
          ) {
            let sames = [];
            result = [];
            for (const color of combo.baseResult) {
              if (sames.includes(color)) continue;
              let count = combo.baseResult.filter((c) => c === color).length;
              result.push(`${count * 25}% ${color}`);
              sames.push(color);
            }
            result = result.join(", ");
            break;
          }
        }
        if (!result) return await interaction.editReply("How the fuck did you get this? Probs tag @ dev");

        let newMessage = `Bases: ${firstChoice} + ${secondChoice}\nResults: ${result}`;

        return await interaction.editReply({ content: newMessage });

      /// breed subcommand
      case "breed":
        const firstBreed = interaction.options.getString("breed1");
        const secondBreed = interaction.options.getString("breed2");
        // loop to find the 4 results from base breeding
        for (const combo of horseCross) {
          if (
            (combo.parents[0] === firstBreed && combo.parents[1] === secondBreed) ||
            (combo.parents[1] === firstBreed && combo.parents[0] === secondBreed)
          ) {
            result = combo.foal.join(", ");
            break;
          }
        }
        if (!result) result = `25% ${firstBreed}, 25% ${secondBreed}, 50% grade`;

        let breedMessage = `Parents: ${firstBreed} + ${secondBreed}\nFoal: ${result}`;

        return await interaction.editReply({ content: breedMessage });
      default:
        return await interaction.editReply("error message I'm so confused where am I");
    }
  },
};
