const fs = require('fs');
const { banPaths, banSources, validReasons } = require('../config');
// Construir regex de razones válidas con límites de palabra
const reasonsRegex = new RegExp(`\\b(${validReasons.map(r => r.replace(/[\\-\\/\\\\\\^\\$\\*\\+\\?\\.\\(\\)\\|\\[\\]\\{\\}]/g, "\\$&")).join("|")})\\b`, 'i');

const bansFilePath = banPaths.txadmin;
let cache = null;
let lastLoad = 0;
let indexData = null;

// Mismos criterios de validez de ban
function isBanActive(ban) {
  if (ban.revocation && ban.revocation.timestamp) return false;
  if (ban.expiration === false) return true;
  if (typeof ban.expiration === 'number') {
    return Math.floor(Date.now() / 1000) < ban.expiration;
  }
  return false;
}

function matchesReason(reason) {
  return typeof reason === 'string' && reasonsRegex.test(reason);
}

function buildIndex(bansList) {
  const idx = {};
  const prefixes = ['license:', 'steam:', 'discord:', 'live:', 'xbl:'];
  bansList.forEach(ban => {
    // identifiers
    (ban.ids || []).forEach(id => {
      const ids = [id];
      prefixes.forEach(p => { if (!id.startsWith(p)) ids.push(`${p}${id}`); });
      ids.forEach(nid => { idx[nid] = { source: 'txadmin', ...ban }; });
    });
    // tokens
    if (ban.tokens) ban.tokens.forEach(t => { idx[t] = { source: 'txadmin', ...ban }; });
  });
  return idx;
}

function load() {
  const now = Date.now();
  if (!cache || now - lastLoad >= 3600000) {
    try {
      const raw = fs.readFileSync(bansFilePath, 'utf8');
      const data = JSON.parse(raw);
      // filtrar acciones
      const actions = (data.actions || []).filter(a => a.type === 'ban' && matchesReason(a.reason) && isBanActive(a));
      cache = actions;
      lastLoad = now;
      indexData = buildIndex(actions);
      console.log('Índice TxAdmin actualizado.');
    } catch (err) {
      console.error('Error al cargar o procesar playersDB.json (txadmin):', err);
      cache = indexData = null;
    }
  }
}

function find(id) {
  if (!indexData) return null;
  return indexData[id] || null;
}

module.exports = { load, find };