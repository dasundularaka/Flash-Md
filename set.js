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
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQU4vZElQS3RUYzdyakVZcmZTeDZYOElzVTdlWjN4NG5wdlZ4UEFyb3hrND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0RWVVF3TkdaOExEWTMybXNIOWRQNWJnZzQ0SWdNNERTd1d3YnNJd3EyTT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0RFMrdC8wU20zQjFxQ1Q2a1VRaEUyQnNPL01oUHg1VytRdndxOGNBaDJJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJoY29KbWROcm5MNXNtejcvQ0hQcUxNOU13MnREelNiZVpZZit4NE1qOEE0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNCb3lEN2NnZU9MZnArZ2FXM283b2ZzZjBobXZvemIrV2JLQ1hYNUd4RmM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNzWFprTTdPTm1ER3FXaG5WeWFkOWRNQUtOUk5WNmdVSmg4VGJCWGt2aXM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS0FST3FzVnJKbVYrMyt3ZlRKUmFXK3BGUEI2YTAzeTZlcGttZEZDcTgwST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUFpQmxzZWFZbUp1Z3pSQUZzVDFrWWFad0NHaGJDV2RvWk9kTnFuZnVEMD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InZZdzZYV0xOQSt5VGtsREdZdVdrRTBZbEZORlZIazEveXNoZW5Ya0lDK0J1UkMwRFNocVQ1ZGR6czBwTUY3WUtiUFlkYi9yZ1lHMmZGdWNWZjdGbGlBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjUxLCJhZHZTZWNyZXRLZXkiOiJySVZ6d0F2MGk4S2ptVU5vbGZLbS9MM0xuQkplZlRWdHk2QTJlVXV4VzhBPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiIxTHhUQXZCSlR2bUN6MjZUQ3F1Y3J3IiwicGhvbmVJZCI6IjQwNzVjOGExLWM3ZjAtNGQ5My05ZmQ2LTE3NjYwNjc0NjEwYiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ6c0hrN25lQW9RTGpOZVVuM2h4TytUTHdOTnM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiM2NmRXRWYTVVR3ZkQjlvUHczL0FyeTZlWXhvPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkU2MzRZUk04IiwibWUiOnsiaWQiOiI5NDc2NTcxNDQ0Njo4MkBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJEYXN1biBEdWxhcmFrYSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUHFzdmQwRkVMYVBwYndHR0E4Z0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiQjJpVk1nTEFPWTMvc0cxWExlaFVJamc0QUcxcXZCc05GN3ZUbXlVWk9XWT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiY3RJNjBaUFVpQlliVzNFVWdBZGtqcWJvM0I3K3V4dms5RlZuS1oyQWp2elFTb3RoM1BWeEJVTzJZQU9raHZDQlhXQUJQTnJNN1ZzSU5KOUpxdGlHQlE9PSIsImRldmljZVNpZ25hdHVyZSI6ImJWNnczT2dCRmJURC9YU0dqQ3AzclN1RTN2bmEzTmRVUXE4dmljVGQ0VkZkbzNJcnMybG9tdzVZdEV5NGdabEs2UldVY3R3bzJJZHVsdGVNL3BxcmlBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NjU3MTQ0NDY6ODJAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCUWRvbFRJQ3dEbU4vN0J0Vnkzb1ZDSTRPQUJ0YXJ3YkRSZTcwNXNsR1RsbSJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczNzA1MDA1MiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFKaVEifQ==',
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
