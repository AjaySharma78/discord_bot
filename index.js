import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import mongoose from "mongoose";
import express from "express";
import UrlShort from "./urlSchema.js";
import { nanoid } from "nanoid";
import config from "./config.js";
import { display, formatDates } from "./weather.js";

const password = encodeURIComponent(config.mongopassword);
const mongoUrl = `mongodb+srv://${config.mongoUrl}:${password}@cluster2.7vkjf.mongodb.net/`;

mongoose
    .connect(mongoUrl)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
const app = express();

client.on("messageCreate", (message) => {
    if(message.author.bot) return;
    message.reply("Hi from Ajay Sharma!");
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName === "create") {
        const ajayValue = interaction.options.getString("link");
        const shortId = nanoid(8);
        if (!ajayValue ||(!ajayValue.startsWith("http://") && !ajayValue.startsWith("https://"))) {
            return await interaction.reply({
                content: "URL is required and must start with http:// or https://",
                ephemeral: true,
            });
        }

        await UrlShort.create({
            shortId: shortId,
            redirectUrl: ajayValue,
            createdBy: interaction.user.username,
        });

        await interaction.reply(`Shortened URL: ${config.urlEndPoint}${shortId}`);
    } else if (interaction.commandName === "dailyweather") {
        const lat = interaction.options.getString("lat");
        const lon = interaction.options.getString("lon");

        const result = await display(lat, lon);
        if (!result) {
            return await interaction.reply("Error fetching weather data");
        }
        const daily = result.daily_result;
        const format = formatDates(daily.list);

        const weatherEmbed = new EmbedBuilder()
            .setColor("Navy")
            .setTitle("Weather Information")
            .setDescription(
                `16 Days weather details for coordinates (${lat}, ${lon})`
            )
            .addFields(
                {
                    name: "`Temperature`",
                    value: `${daily.list[0].temp.day}°C`,
                    inline: true,
                },
                { name: "`City`", value: `${daily.city.name}`, inline: true },
                { name: "`Country`", value: `${daily.city.country}`, inline: true },
                {
                    name: "`Day`",
                    value: `${format.map((dateInfo) => `${dateInfo.day}`).join("\n")}`,
                    inline: true,
                },
                {
                    name: "`Date`",
                    value: `${format
                        .map((dateInfo) => `${dateInfo.month},${dateInfo.date}`)
                        .join("\n")}`,
                    inline: true,
                },
                {
                    name: "`Temperature`",
                    value: `${daily.list.map((item) => `${item.temp.day}°C`).join("\n")}`,
                    inline: true,
                },
                {
                    name: "`Humidity`",
                    value: `${daily.list.map((item) => `${item.humidity}%`).join("\n")}`,
                    inline: true,
                },
                {
                    name: "`Wind Speed`",
                    value: `${daily.list.map((item) => `${item.speed}m/s`).join("\n")}`,
                    inline: true,
                },
                {
                    name: "`Cloudiness`",
                    value: `${daily.list.map((item) => `${item.clouds}%`).join("\n")}`,
                    inline: true,
                },
                {
                    name: "`Pressure`",
                    value: `${daily.list
                        .map((item) => `${item.pressure}hPa`)
                        .join("\n")}`,
                    inline: true,
                },
                {
                    name: "`Description`",
                    value: `${daily.list
                        .map((item) => `${item.weather[0].description}`)
                        .join("\n")}`,
                    inline: true,
                },
                {
                    name: "`Sunrise`",
                    value: `${daily.list
                        .map((item) => `${new Date(item.sunrise * 1000)}`)
                        .join("\n")}`,
                    inline: false,
                },
                {
                    name: "`Sunset`",
                    value: `${daily.list
                        .map((item) => `${new Date(item.sunset * 1000)}`)
                        .join("\n")}`,
                    inline: false,
                }
            );
        await interaction.reply({ embeds: [weatherEmbed] });
    } else if (interaction.commandName === "todayweather") {
        const lat = interaction.options.getString("lat");
        const lon = interaction.options.getString("lon");

        const result = await display(lat, lon);
        if (!result) {
            return await interaction.reply("Error fetching weather data");
        }
        const daily = result.daily_result;
        const format = formatDates(daily.list);
        const sunrise = new Date(daily.list[0].sunrise * 1000);
        const sunset = new Date(daily.list[0].sunset * 1000);
        const weatherEmbed = new EmbedBuilder()
            .setColor("DarkOrange")
            .setTitle("`Weather Information`")
            .setDescription(`Today weather details for coordinates (${lat}, ${lon})`)
            .addFields(
                {
                    name: "`Temperature`",
                    value: `${daily.list[0].temp.day}°C`,
                    inline: true,
                },
                { name: "`City`", value: `${daily.city.name}`, inline: true },
                { name: "`Country`", value: `${daily.city.country}`, inline: true },
                { name: "`Day`", value: `${format[0].day}`, inline: true },
                {
                    name: "`Date`",
                    value: `${(format[0].month, format[0].date)}`,
                    inline: true,
                },
                {
                    name: "`Description`",
                    value: `${daily.list[0].weather[0].description}`,
                    inline: true,
                },
                {
                    name: "`Pressure`",
                    value: `${daily.list[0].pressure}hPa`,
                    inline: true,
                },
                { name: "`Humidity`", value: `${daily.list[0].humidity}%`, inline: true },
                {
                    name: "`Wind Speed`",
                    value: `${daily.list[0].speed}m/s`,
                    inline: true,
                },
                { name: "`Cloudiness`", value: `${daily.list[0].clouds}%`, inline: true },
                { name: "`Sunrise`", value: `${sunrise}`, inline: true },
                { name: "`Sunset`", value: `${sunset}`, inline: true }
            );
        await interaction.reply({ embeds: [weatherEmbed] });
    }
});

app.get("/:shortId", async (req, res) => {
    const { shortId } = req.params;
    const urlEntry = await UrlShort.findOne({ shortId });

    if (urlEntry) {
        res.redirect(urlEntry.redirectUrl);
    } else {
        res.status(404).send("URL not found");
    }
});

client.login(config.discordToken);

app.listen(config.port || 3000, () => {
    console.log("Server is running on port 3000");
});
