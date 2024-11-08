const { SlashCommandBuilder } = require("discord.js");
const baseCombos = require("../../functions/datafiles/horseColors.json");
const breeds = require("../../functions/datafiles/breeds.json");
const horseCross = require("../../functions/datafiles/horseCross.json");
const horseInfo = require("../../functions/datafiles/horseInfo.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("horse")
    .setDescription("Find foal information: base colors, crosses, height, etc.")
    // color command
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
    // breed command
    .addSubcommand((subcommand) =>
      subcommand
        .setName("breed")
        .setDescription("Find breed crossing information.")
        .addStringOption((option) =>
          option.setName("breed1").setDescription("First parent's breed.").setRequired(true).setAutocomplete(true)
        )
        .addStringOption((option) =>
          option.setName("breed2").setDescription("Second parent's breed.").setRequired(true).setAutocomplete(true)
        )
    )
    // info command
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Search up main info about a breed.")
        .addStringOption((option) =>
          option
            .setName("breed")
            .setDescription("The name of the breed you want to seach.")
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

    //prettier-ignore
    switch (interaction.options.getSubcommand(false)) {
      case "color": return await hColor(interaction, client); // color command case
      case "breed": return await hBreed(interaction, client); // breed command case
      case "info":return await hInfo(interaction, client); // info command reply

      default:
        return await interaction.editReply("error message I'm so confused where am I");
    }
  },
};

///----- horse color command -----///
async function hColor(interaction, client) {
  const firstChoice = interaction.options.getString("color1");
  const secondChoice = interaction.options.getString("color2");
  let result = null;

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
  // output embed
  const embed = client.makeEmbed("Base color combo result.", newMessage);
  return await interaction.editReply({ embeds: [embed] });
}

///----- horse breed command -----///
async function hBreed(interaction, client) {
  const firstBreed = interaction.options.getString("breed1");
  const secondBreed = interaction.options.getString("breed2");
  let result = null;

  var filtered1 = horseInfo.filter((horse) => horse.breed === firstBreed);
  if (filtered1.length === 0)
    return await interaction.editReply(`This breed doesn't exist or is missing. You wrote: __${firstBreed}__`);
  var filtered2 = horseInfo.filter((horse) => horse.breed === secondBreed);
  if (filtered2.length === 0)
    return await interaction.editReply(`This breed doesn't exist or is missing. You wrote: __${secondBreed}__`);

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
  if (!result) {
    if (
      (filtered1[0].type === "Draft" && filtered2[0].type === "Pony") ||
      (filtered1[0].type === "Pony" && filtered2[0].type === "Draft")
    )
      result = `**Crossing draft horses with ponies is not permitted.**`;
    else result = `25% ${firstBreed}, 25% ${secondBreed}, 50% grade`;
  }

  let newMessage = `Parents: ${firstBreed} + ${secondBreed}\nFoal: ${result}`;
  // output embed
  const embed = client.makeEmbed("Cross breed result.", newMessage);
  return await interaction.editReply({ embeds: [embed] });
}

///----- horse info command -----///
async function hInfo(interaction, client) {
  const breed = interaction.options.getString("breed");
  let result = null;

  // only lets through the chosen info (breed)
  var filtered = horseInfo.filter((horse) => horse.breed === breed);

  if (filtered.length === 0)
    return await interaction.editReply(`This breed doesn't exist or is missing. You wrote: __${breed}__`);
  result = filtered[0];
  let newMessage = [
    `**${result.breed}**`,
    `Type: *${result.type}*`,
    `Height: *${result.low.toFixed(1)} - ${result.top.toFixed(1)}*`,
    `Terrain Found: *${result.terrain}*`,
    `Arena Bonus: *${result.arena_bonus}*`,
  ].join("\n");

  // output embed
  const embed = client.makeEmbed("Horse info.", newMessage);
  return await interaction.editReply({ embeds: [embed] });
}
