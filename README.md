# Bot Comunidad

Bot de Discord para verificar baneos en múltiples sistemas (Anticheat, TxAdmin, etc.) de manera modular.

## Descripción
Este proyecto permite consultar baneos de jugadores mediante comandos de Discord (`+check <identificador>`) y devuelve información de las fuentes configuradas (por ejemplo, archivos JSON de Anticheat y TxAdmin). La lógica de búsqueda está organizada en módulos por fuente, fáciles de extender.

## Requisitos
- Node.js v16 o superior
- npm (gestor de paquetes)
- Acceso a los archivos de baneos (JSON) de cada sistema

## Configuración e instalación paso a paso

Esta guía te llevará de la mano, incluso si nunca has usado Node.js o creado un bot de Discord.

### 1. Instalar Node.js
- Descarga e instala Node.js (v16+) desde https://nodejs.org/
  Asegúrate de que `node --version` y `npm --version` funcionen en tu terminal.

### 2. Crear y configurar tu bot en Discord
1. Ve al [Portal de Desarrolladores de Discord](https://discord.com/developers/applications) y crea una nueva aplicación.
2. En la sección "Bot", haz clic en "Add Bot" y copia el **token**.
3. En "OAuth2 > URL Generator", marca los scopes `bot` y permisos `Read Messages`, `Send Messages` y `Add Reaction`.
4. Copia la URL generada e invita el bot a tu servidor.

### 3. Clonar el proyecto
```powershell
git clone <repositorio> BotComunidad
cd BotComunidad
```

### 4. Instalar dependencias
```powershell
npm install
```

### 5. Configurar variables de entorno
1. Copia la plantilla:
   ```powershell
   copy .env.example .env
   ```
2. Abre `.env.example` y completa:
   - `DISCORD_TOKEN`: el token de tu bot.
   - `CLIENT_ID` y `GUILD_ID`: aparecen en tu aplicación de Discord.
   - `BANS_SOURCES`: lista de fuentes (por ejemplo `anticheat,txadmin`).
   - `BANS_FILE_PATH_<FUENTE>`: rutas absolutas a los archivos JSON de baneos.

Modifica el archivo `.env.example` para que se llame `.env`.

### 6. Ejecutar el bot
- Modo desarrollo (recarga automática):
  ```powershell
  npm run dev
  ```
- Modo producción:
  ```powershell
  npm start
  ```

Una vez iniciado, tu bot estará en línea y responderá al comando `+check <identificador>`.
Ejemplo:
```text
+check steam:110000112345678
```  
Si hay baneos, recibes embeds; si no, reaccionará con ❌.

## Configuración
Todas las rutas y credenciales se leen desde variables de entorno. El archivo `utils/config.js` gestiona:
- `DISCORD_TOKEN`: Token del bot
- `BANS_SOURCES`: Fuentes habilitadas, por defecto `anticheat,txadmin`
- `BANS_FILE_PATH_<FUENTE>`: Ruta al JSON de cada fuente (por ejemplo `BANS_FILE_PATH_ANTICHEAT`)

## Estructura de archivos
```
BotComundad/
├─ index.js                # Punto de entrada, maneja eventos de Discord
├─ .env                    # Variables de entorno (no comitear)
├─ package.json            # Dependencias y scripts
└─ utils/
   ├─ config.js            # Lectura y validación de ENV
   └─ bans/
      ├─ index.js          # Orquestador de fuentes (loadAll, findIn)
      ├─ anticheat.js      # Módulo de búsqueda en bans.json (Anticheat)
      └─ txadmin.js        # Módulo de búsqueda en playersDB.json (TxAdmin)
```

## Uso
En cualquier canal donde el bot tenga permisos de leer y escribir mensajes, ejecuta:
```
+check <identificador>
```
Ejemplo:
```
+check steam:110000112345678
```

El bot responderá con uno o varios embeds si el jugador está baneado, o reaccionará con ❌ si no se encuentra baneo.

## Añadir nuevas fuentes de baneo
1. Crea un nuevo módulo en `utils/bans/<fuente>.js` con `load()` y `find(id)`.
2. Define la ruta en `.env` como `BANS_FILE_PATH_<FUENTE>`.
3. Agrega el nombre de la fuente en `BANS_SOURCES` en `.env`.
El orquestador detectará y cargará dinámicamente tu módulo.

*Dudas o sugerencias? Enviar un mensaje a @DanoGlez.*
---

**¡Listo!** Ahora tienes un bot modular y escalable para gestionar consultas de baneos en Discord.
