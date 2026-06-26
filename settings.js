const fs = require('fs-extra');
const path = require('path');

const settingsFile = path.join(__dirname, 'database', 'settings.json');

function loadSettings() {
  if (fs.existsSync(settingsFile)) {
    return JSON.parse(fs.readFileSync(settingsFile));
  }
  return {
    autoRead: true,
    autoReact: false,
    autoWelcome: true,
    autoGoodbye: true,
    antiLink: false,
    antiBadWord: false,
    antiArab: false,
    antiEmoji: false,
    welcomeMessage: 'Welcome @user to @group!',
    goodbyeMessage: '@user has left.',
    muteAll: false,
    lang: 'english', // 'english' or 'shona'
  };
}

function saveSettings(settings) {
  fs.ensureDirSync(path.dirname(settingsFile));
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
}

module.exports = { loadSettings, saveSettings };