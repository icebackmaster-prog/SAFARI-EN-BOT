require('dotenv').config();

module.exports = {
  owner: process.env.OWNER_NUMBER || '263788377887',
  ownerName: process.env.OWNER_NAME || 'SAFARI',
  botName: process.env.BOT_NAME || 'SAFARI EN',
  prefix: process.env.PREFIX || '!',
  sessionName: 'session',
  timezone: 'Africa/Harare',
  apiKeys: {
    openai: process.env.OPENAI_API_KEY || '',
    weather: process.env.WEATHER_API_KEY || '',
    translate: process.env.TRANSLATE_API_KEY || '',
  },
  limits: {
    maxWarn: 3,
    banDuration: 86400000, // 24h
  },
  menu: {
    thumbnail: './media/menu.jpg',
    footer: '© SAFARI EN 2026',
  },
  database: {
    type: process.env.DB_TYPE || 'json', // 'json' or 'mongo'
    mongoURI: process.env.MONGO_URI || '',
  },
  autoBackup: true,
  backupInterval: 3600000, // 1 hour
};