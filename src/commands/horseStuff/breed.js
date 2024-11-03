const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const breeds = require("../../functions/datafiles/breeds.json");
const Breedlist = require("../../schemas/breedlist"); //needs same const name as in schema
const mongoose = require("mongoose");
const Hiuser = require("../../schemas/hiuser");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("breed")
    .setDescription("Set up your breeding list.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("register")
        .setDescription("Connect your HI username to your Discord acc.")
        .addStringOption((option) =>
          option.setName("hi-user").setDescription("Your in game username. (LC only)").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("new-user").setDescription("Change in game username. (LC only)").setRequired(false)
        )
    )
    // Add command
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a breed to your current list.")
        .addStringOption((option) =>
          option.setName("breed").setDescription("The name of the breed you want to add.").setRequired(true).setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("wilds")
            .setDescription("Do you want wilds in that breed?")
            .setRequired(true)
            .addChoices({ name: "Yes", value: "True" }, { name: "No", value: "False" })
        )
        .addStringOption((option) =>
          option.setName("stats").setDescription(`(stat + persona) There is 15 char limit.`).setRequired(false).setMaxLength(15)
        )
        .addStringOption((option) => option.setName("color").setDescription("Add any color preferences.").setRequired(false))
        .addStringOption((option) =>
          option.setName("markings").setDescription("Add any markings preferences.").setRequired(false)
        )
        .addStringOption((option) => option.setName("notes").setDescription("Other notes you want displayed.").setRequired(false))
    )
    // Edit command
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit a breed on your current list.")
        .addStringOption((option) =>
          option
            .setName("breed")
            .setDescription("The name of the breed you want to edit.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("wilds")
            .setDescription("Do you want wilds in that breed?")
            .setRequired(true)
            .addChoices({ name: "Yes", value: "True" }, { name: "No", value: "False" })
        )
        .addStringOption((option) =>
          option.setName("stats").setDescription(`(stat + persona) There is 15 char limit.`).setRequired(false).setMaxLength(15)
        )
        .addStringOption((option) => option.setName("color").setDescription("Edit the color preferences.").setRequired(false))
        .addStringOption((option) =>
          option.setName("markings").setDescription("Edit the markings preferences.").setRequired(false)
        )
        .addStringOption((option) => option.setName("notes").setDescription("Edit the notes.").setRequired(false))
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

    const command = interaction.options.getSubcommand(false);

    try {
      let hiuserObject = await Hiuser.findOne({ discordId: interaction.user.id });
      if (!hiuserObject && command !== "register") {
        return await interaction.editReply(
          `Your account doesn't have a HI user registered.\nDo "/breed register" to connect your HI username to your Discord account.`
        );
      }
      //prettier-ignore
      switch (command) {
        case "register": return await userAdd(interaction, client, hiuserObject); //ppl adding their username to disc
        case "add": return await breedAdd(interaction, client, hiuserObject); //ppl adding their breeds
        case "edit": return await breedEdit(interaction, client, hiuserObject); //edit breeds
        default: return await interaction.editReply("How the fuck did you get this? Probs tag @ dev"); //I fucked something up
      }
    } catch (err) {
      console.log(err);
      return await interaction.editReply("Something went wrong while executing the command."); //mongo fucked something up
    }
  },
};

///----- register command -----///
async function userAdd(interaction, client, hiuserObject) {
  const hiuser = interaction.options.getString("hi-user").replace(/[^a-zA-Z]/g, "");
  // wrong username probably
  if (!hiuser || hiuser === "") return await interaction.editReply("Please enter a valid HI username.");

  let newUser = interaction.options.getString("new-user");
  ///--- if already registered, renaming
  if (hiuserObject) {
    // tried to re-register or failed to rename themselves
    if (!newUser) {
      return await interaction.editReply(
        `Your Discord account already has a HI user connected.\nTo rename your HI username, add your new name in "new-user". If you want to disconnect your Discord account @ dev.`
      );
    }
    newUser = newUser.replace(/[^a-zA-Z]/g, "");
    if (!newUser || newUser === "") return await interaction.editReply("Please enter a valid HI username.");

    // probably dyslexic (like me :D)
    if (hiuserObject.hiUsername !== hiuser) {
      return await interaction.editReply(
        `HI username you wrote does not match the one connected to your Discord account. It's case sensitive.\nYou wrote: "${hiuser}"`
      );
    }
    // they tried to rename themselves to the same thing
    if (hiuser === newUser) return await interaction.editReply(`HI username "${newUser}" is already taken... By you.`);
    // someone either didn't rename their user or stole someone elses
    let yoinkedObject = await Hiuser.findOne({ hiUsername: new RegExp("^" + newUser + "$", "i") });
    if (yoinkedObject) {
      if (yoinkedObject.id !== hiuserObject.id)
        return await interaction.editReply(`HI username "${newUser}" is already taken. If it's your IG username @ dev.`);
    }

    //--- rename ---//
    await Hiuser.updateOne(
      { _id: hiuserObject.id },
      { hiUsername: newUser, dateEdited: new Date(), serverId: interaction.guild.id }
    );
    return await interaction.editReply(`Connected HI username renamed to "${newUser}".`);
  }
  ///--- registering
  let dumbass = ""; // if they register and rename with the same name????
  if (newUser) {
    newUser = newUser.replace(/[^a-zA-Z]/g, "");
    if (hiuser === newUser) dumbass = `.. But you didn't need to write it twice.`;
    else return await interaction.editReply("Please register first by giving only your HI username once.");
  }
  // registering but username taken
  let yoinkedObject = await Hiuser.findOne({ hiUsername: new RegExp("^" + hiuser + "$", "i") });
  if (yoinkedObject)
    return await interaction.editReply(`HI username "${hiuser}" is already taken. If it's your IG username @ dev.`);

  //--- Actually registering ---//
  await Hiuser.create({
    _id: new mongoose.Types.ObjectId(),
    discordId: interaction.user.id,
    hiUsername: hiuser,
    dateEdited: new Date(),
    serverId: interaction.guild.id,
  });
  return await interaction.editReply(`User "${hiuser}" registered successfully.` + dumbass);
}

///----- breed add command -----///
async function breedAdd(interaction, client, hiuserObject) {
  const hiuser = hiuserObject.hiUsername;
  const breed = interaction.options.getString("breed");
  var filtered = breeds.filter((horse) => horse.breed === breed);
  if (filtered.length === 0) return await interaction.editReply(`This breed doesn't exist or is missing. You wrote: "${breed}"`);
  const wilds = interaction.options.getString("wilds") === "True" ? true : false;
  const stats = interaction.options.getString("stats") || null;
  const color = interaction.options.getString("color") || null;
  const markings = interaction.options.getString("markings") || null;
  const notes = interaction.options.getString("notes") || null;

  let breedlistObject = await Breedlist.findOne({ discordId: interaction.user.id, breed: breed });
  if (breedlistObject)
    return await interaction.editReply(
      `"${hiuser}" already has a "${breed}" horse registered.\nDo "/breed edit" to edit info or do "/breed remove" to remove the breed.`
    );

  await Breedlist.create({
    _id: new mongoose.Types.ObjectId(),
    discordId: interaction.user.id,
    breed: breed,
    wilds: wilds,
    statsPersona: stats,
    color: color,
    markings: markings,
    notes: notes,
  });
  let message = [`__Added to "${hiuser}"s list.__`, ``, `**Breed:** ${breed}`, `**Wilds:** ${wilds ? "yes" : "no"}`];
  if (stats) message.push(`**Stats:** ${stats}`);
  if (color) message.push(`**Color info:** ${color}`);
  if (markings) message.push(`**Markings info:** ${markings}`);
  if (notes) message.push(`**Extra notes:**\n${notes}`);

  const embed = new EmbedBuilder().setTitle("Breed added.").setDescription(message.join("\n")).setColor(0x9acd32);

  await interaction.editReply({ embeds: [embed] });
}

///----- breed edit command -----///
async function breedEdit(interaction, client, hiuserObject) {
  const hiuser = hiuserObject.hiUsername;
  const breed = interaction.options.getString("breed");
  var filtered = breeds.filter((horse) => horse.breed === breed);
  if (filtered.length === 0) return await interaction.editReply(`This breed doesn't exist or is missing. You wrote: "${breed}"`);

  let breedlistObject = await Breedlist.findOne({ discordId: interaction.user.id, breed: breed });
  if (!breedlistObject) return await interaction.editReply(`"${breed}" hasn't been registered in "${hiuser}"s list.`);

  let wilds = interaction.options.getString("wilds") || null;
  if (wilds) wilds = wilds === "True" ? true : false;
  const stats = interaction.options.getString("stats") || null;
  const color = interaction.options.getString("color") || null;
  const markings = interaction.options.getString("markings") || null;
  const notes = interaction.options.getString("notes") || null;
}
