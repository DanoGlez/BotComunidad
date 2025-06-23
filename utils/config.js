// Cargar variables de entorno
dotenv = require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
// ID de cliente y servidor para comandos slash (opcionales)
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// Rutas de archivos de baneos por fuente (definidas en .env como BANS_FILE_PATH_<FUENTE>)
const banSources = (process.env.BANS_SOURCES || 'anticheat,txadmin')
  .split(',')
  .map((s) => s.trim().toLowerCase());
const banPaths = banSources.reduce((acc, src) => {
  const envVar = `BANS_FILE_PATH_${src.toUpperCase()}`;
  const p = process.env[envVar];
  if (!p) {
    console.error(`⚠️ Variable de entorno ${envVar} no definida.`);
    process.exit(1);
  }
  acc[src] = p;
  return acc;
}, {});

// Leer razones de baneo válidas desde .env (o usar lista por defecto)
const validReasons = (process.env.BANS_VALID_REASONS || 'hacker,cheeter,cheater,cheeater,refuse,chetos,spoofer,no recoil,noclip,spoofed,aimbot,cheats,cheat')
  .split(',')
  .map(r => r.trim().toLowerCase());

if (!token) {
  console.error('⚠️ DISCORD_TOKEN no definido en .env.');
  process.exit(1);
}

// Fuentes de baneos habilitadas (anticheat, txadmin, etc.)
module.exports = { token, clientId, guildId };
// Exportar configuración de fuentes y rutas
module.exports.banSources = banSources;
module.exports.banPaths = banPaths;
module.exports.validReasons = validReasons;