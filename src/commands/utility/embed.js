const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("embedtest").setDescription("Returns an embed."),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`This is an EMBED!`)
      .setDescription("This is a very cool description!")
      .setColor(0xffccc)
      .setImage(client.user.displayAvatarURL()) //big image
      .setThumbnail(client.user.displayAvatarURL()) //small image
      .setTimestamp(Date.now())
      .setAuthor({
        url: `https://www.youtube.com/watch?v=DB8a8i1pXUM&list=PLv0io0WjFNn9LDsv1W4fOWygNFzY342Jm&index=3`, //makes the username of who used the command a link
        iconURL: interaction.user.displayAvatarURL(), //display the avatar of who used the command
        name: interaction.user.tag, //username of whoever used the command
      })
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag,
      })
      .setURL(`https://youtube.com`) //makes the title a hyperlink
      .addFields([
        {
          name: `Field 1`,
          value: `Field value 1`,
          inline: true, //line up stuff horisontally
        },
        {
          name: `Field 2`,
          value: `Field value 2`,
          inline: true,
        },
      ]);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
