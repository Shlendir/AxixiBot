const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const breeds = require("../../functions/datafiles/breeds.json");
const Breedlist = require("../../schemas/breedlist"); //needs same const name as in schema
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("breed")
    .setDescription("Set up your breeding list.")
    // Add command
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a breed to your current list.")
        .addStringOption((option) =>
          option.setName("hi-user").setDescription("Add your in game username. (LC only)").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("breed").setDescription("The name of the breed you want to add.").setRequired(true).setAutocomplete(true)
        )
        .addBooleanOption((option) =>
          option.setName("wilds").setDescription("Do you want wilds in that breed?").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("stats").setDescription(`(stat + persona) There is 15 char limit.`).setRequired(false).setMaxLength(15)
        )
        .addStringOption((option) => option.setName("color").setDescription("Add any color preferences.").setRequired(false))
        .addStringOption((option) =>
          option.setName("markings").setDescription("Add any markings preferences.").setRequired(false)
        )
        .addStringOption((option) => option.setName("notes").setDescription("Other notes you want displayed.").setRequired(false))
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

    try {
      switch (interaction.options.getSubcommand(false)) {
        case "add":
          return await breedAdd(interaction, client);
        default:
          return await interaction.editReply("How the fuck did you get this? Probs tag @ dev");
      }
    } catch (err) {
      console.log(err);
      return await interaction.editReply("Something went wrong while executing the command.");
    }
  },
};

// breed add command
async function breedAdd(interaction, client) {
  const hiuser = interaction.options.getString("hi-user");
  const breed = interaction.options.getString("breed");
  var filtered = breeds.filter((horse) => horse.breed === breed);
  if (filtered.length === 0)
    return await interaction.editReply(`This breed doesn't exist or is missing. You wrote: __${breed}__`);
  const wilds = interaction.options.getBoolean("wilds");
  const stats = interaction.options.getString("stats") || null;
  const color = interaction.options.getString("color") || null;
  const markings = interaction.options.getString("markings") || null;
  const notes = interaction.options.getString("notes") || null;

  let breedlistObject = await Breedlist.findOne({ hiUsername: hiuser, breed: breed });
  if (breedlistObject)
    return await interaction.editReply(
      `${hiuser} already has a ${breed} horse registered.\nDo "/breed edit" to edit info or do "/breed remove" to remove the breed.`
    );

  await Breedlist.create({
    _id: new mongoose.Types.ObjectId(),
    discordId: interaction.user.id,
    hiUsername: hiuser,
    breed: breed,
    wilds: wilds,
    statsPersona: stats,
    color: color,
    markings: markings,
    notes: notes,
  });
  let message = [`__Added to ${hiuser}'s list.__`, ``, `**Breed:** ${breed}`, `**Wilds:** ${wilds ? "yes" : "no"}`];
  if (stats) message.push(`**Stats:** ${stats}`);
  if (color) message.push(`**Color info:** ${color}`);
  if (markings) message.push(`**Markings info:** ${markings}`);
  if (notes) message.push(`**Extra notes:**\n${notes}`);

  const embed = new EmbedBuilder().setTitle("Breed added.").setDescription(message.join("\n")).setColor(0x9acd32);

  await interaction.editReply({ embeds: [embed] });
}
