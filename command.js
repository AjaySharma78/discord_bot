import { REST, Routes, SlashCommandBuilder } from "discord.js";
import config from "./config.js";
const commands = [
  new SlashCommandBuilder()
    .setName("createlink")
    .setDescription("Replies with pong!")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("https://example.com")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("todayweather")
    .setDescription("Get the weather of a city")
    .addStringOption((option) =>
      option.setName("lat").setDescription("latitude").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("lon").setDescription("longitude").setRequired(true)
    ),
    new SlashCommandBuilder()
    .setName("dailyweather")
    .setDescription("Get the weather of a city")
    .addStringOption((option) =>
      option.setName("lat").setDescription("latitude").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("lon").setDescription("longitude").setRequired(true)
    ),
    new SlashCommandBuilder()
    .setName("checklink")
    .setDescription("Get the link details")
    .addStringOption((option) =>
      option.setName("id").setDescription("/N62EfjNv last 8 digit of link created using this server.").setRequired(true)
    ),
    new SlashCommandBuilder()
    .setName("deletelink")
    .setDescription("Delete the link")
    .addStringOption((option) =>
      option.setName("id").setDescription("/N62EfjNv last 8 digit of link created using this server.").setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(config.discordToken);

try {
  await rest.put(Routes.applicationCommands(config.discordUserId), {
    body: commands,
  });
} catch (error) {
  console.error(error);
}
