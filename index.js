const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const path = require("path");

// Configuración y sistema de baneos
const { token } = require("./utils/config");
const { loadAll, findIn, banSources } = require("./utils/bans/index.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Bot online");
});

client.login(token);

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("+check") || message.author.bot) return;

  const args = message.content.slice(6).trim().split(" ");
  const userId = args[0];

  if (!userId) {
    await message.reply("Por favor proporciona un ID para verificar.");
    return;
  }

  // Cargar índices de todas las fuentes configuradas
  loadAll();

  // Buscar en cada fuente
  const embeds = [];
  for (const src of banSources) {
    const ban = findIn(src, userId);
    if (!ban) continue;
    // Construir embed según fuente
    if (src === "anticheat") {
      embeds.push(
        new EmbedBuilder()
          .setTitle("Baneo encontrado en Anticheat")
          .setColor("Orange")
          .addFields(
            { name: "Nombre", value: ban.name || "N/A" },
            { name: "Razón", value: ban.reason || "N/A" },
            {
              name: "Identificadores",
              value: [
                `License: ${ban.license || "N/A"}`,
                `Steam: ${ban.steam || "N/A"}`,
                `Discord: ${ban.discord || "N/A"}`,
                `Live: ${ban.live || "N/A"}`,
                `XBL: ${ban.xbl || "N/A"}`,
              ].join("\n"),
            }
          )
      );
    } else if (src === "txadmin") {
      embeds.push(
        new EmbedBuilder()
          .setTitle("Baneo encontrado en TxAdmin")
          .setColor("Yellow")
          .addFields(
            { name: "Nombre", value: ban.playerName || "N/A", inline: true },
            { name: "Razón", value: ban.reason || "N/A", inline: true },
            {
              name: "Expiración",
              value:
                ban.expiration === false
                  ? "Nunca"
                  : new Date(ban.expiration * 1000).toLocaleString() || "N/A",
              inline: true,
            },
            { name: "Identificadores", value: ban.ids.join("\n") }
          )
      );
    }
  }

  if (embeds.length > 0) {
    for (const embed of embeds) {
      await message.reply({ embeds: [embed] });
    }
  } else {
    await message.react("❌");
  }
});