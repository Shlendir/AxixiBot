const { SlashCommandBuilder } = require("discord.js");
const baseCombos = require("../../functions/datafiles/horseColors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("horse")
    .setDescription("ä")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("color")
        .setDescription("ö")
        .addStringOption((option) =>
          option
            .setName("firstcolor")
            .setDescription("õõ")
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
            .setDescription("ü")
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
    ),
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
