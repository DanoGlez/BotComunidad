const { banSources } = require('../config');
const modules = {};

// Cargar dinámicamente cada módulo de búsqueda de baneos
banSources.forEach((src) => {
  try {
    modules[src] = require(`./${src}`);
  } catch (err) {
    console.warn(`Módulo no encontrado para fuente de baneos: ${src}`);
  }
});

/**
 * Carga o actualiza los índices de todas las fuentes habilitadas
 */
function loadAll() {
  banSources.forEach((src) => {
    if (modules[src] && typeof modules[src].load === 'function') {
      modules[src].load();
    }
  });
}

/**
 * Busca un baneo en una fuente específica
 * @param {string} src - Fuente de baneos (ej: 'anticheat', 'txadmin')
 * @param {string} id - Identificador a buscar
 * @returns {object|null}
 */
function findIn(src, id) {
  if (modules[src] && typeof modules[src].find === 'function') {
    return modules[src].find(id);
  }
  return null;
}

module.exports = { loadAll, findIn, banSources };
