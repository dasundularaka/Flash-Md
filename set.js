const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0VXS3NrVmlrYldEbFBDeEIxUEFMMTdsenpnRUZwK0J3eE40VXcxY0UzYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY2dkNWdmNGVTUktvcUIrL2E4QVYrdjJjK2dmUGFybnovbHJtTnJKQXoxQT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBSjVDWGpDWFZCL2dHT2Rnb0VuVkpBMmpPRUFmUmNrUUx4SDdta1N3WmxRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJMaGN0UWFoN0xPTmovNko4cjFJbTRNSFozdUJyV3I2NXJlQlFzZk1qakgwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImtLTjB6cEFLR2ZHaTBJUmMzSDdKTnhjbnhNem5DaXhtbEJDeUxHR0t2bDA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImM1STRCOXhMVjRoTTBucVVxNitKdDJHUE15SlB0MG1tRG9VRlVtYTBHVEU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidUJMU3JxRWFKVnFZZFhnaHBqYnA3SDFqOWtoaCsydm82Ui9Ud3BVWmRrOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicXdWaUoyL3NZZlNKclVpUGZiQjhpQnVRQjJHOGQ2YnRuRW45dnh4SkFuQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjdTOXJ1T0ovQWpHT1UzNFhBSU1WRUk2ZmlvMm4xRzFYWEFDeThEU1FtMlQ3cjJPRzVrNTdzampzbHhzTFJMbWxJOW1uV1RUMTZ4dUhQc0Rwam1TL2dnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MiwiYWR2U2VjcmV0S2V5IjoibGxkWENLbTFUM2gveEZDTVI5WFhmaGdJc2wxWEFzWWU4VU51OGNSTjV0ND0iLCJwcm9jZXNzZWRIaXN0b3J5TWVzc2FnZXMiOlt7ImtleSI6eyJyZW1vdGVKaWQiOiI5NDc2NTcxNDQ0NkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiIxRUIxRTQ2NDE5RkY1NUQxOTg4NjI1OUU4N0VBMUIzOSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzM3MjAwNzc0fV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiI1c1BUQTVzY1NreXBvVzJUWnJCWWFRIiwicGhvbmVJZCI6IjdjN2Q4M2IxLWFkZGEtNGUzMC04MjE1LWJmY2I2Zjc2MDQxNSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1RGtuY0s4YVRnTDV4bEErSlBDcHpJQURNaTg9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ2I1RDEwUWt5WlB6b0dDSmhIcUNLZ0lieHZzPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ik5NREc4TTRWIiwibWUiOnsiaWQiOiI5NDc2NTcxNDQ0Njo4NEBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJEYXN1biBEdWxhcmFrYSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUHFzdmQwRkVQZW9ycndHR0JFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiQjJpVk1nTEFPWTMvc0cxWExlaFVJamc0QUcxcXZCc05GN3ZUbXlVWk9XWT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiZzBxbWszRDROeHZTRjNIWVpkbFA5LzNZTUZISWJhR2N1VTNTa2FYZEFtYTRzTUJNaGptOEdhVkQyZFhPdVhDWjh1VmlkT09uMkZIdGJKSWkxVXpXRGc9PSIsImRldmljZVNpZ25hdHVyZSI6IlpjNXpFTDJ4bTFpNVlHSmR0UlkweWtTV3g3bXptNStXN2RXaERLcmQ4OWtzSFo0UldVM2tUTzJFZUJNd1lYWGRWbGtrTlNNMklqZmJyV2FMbnUrVWhRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NjU3MTQ0NDY6ODRAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCUWRvbFRJQ3dEbU4vN0J0Vnkzb1ZDSTRPQUJ0YXJ3YkRSZTcwNXNsR1RsbSJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczNzIwMDc3MSwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFKaVEifQ==',
    PREFIXES: (process.env.PREFIX || '.').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "DASUN DULARAKA",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "94765714446",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "off",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "on",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "public",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Asia/Colombo',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
