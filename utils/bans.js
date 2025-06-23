// Proxy para los módulos de baneos en `utils/bans/`
const path = require('path');
// Cargar el módulo principal de baneos (utils/bans/index.js)
module.exports = require(path.join(__dirname, 'bans', 'index.js'));