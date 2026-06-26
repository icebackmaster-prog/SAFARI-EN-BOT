const db = require('../database');
const config = require('../config');

module.exports = {
  name: 'economy',
  async init() {
    // Initialize economy system
    // Add daily reward, work, gamble, etc.
    // This plugin will be loaded automatically
  },
  async daily(sock, msg) {
    const user = msg.key.participant || msg.key.remoteJid;
    const econ = db.economy.read();
    if (!econ[user]) econ[user] = { coins: 0, lastDaily: 0 };
    const now = Date.now();
    if (now - econ[user].lastDaily < 86400000) {
      return sock.sendMessage(msg.key.remoteJid, { text: '⏳ You already claimed daily reward.' });
    }
    const reward = Math.floor(Math.random() * 100) + 50;
    econ[user].coins += reward;
    econ[user].lastDaily = now;
    db.economy.write(econ);
    await sock.sendMessage(msg.key.remoteJid, { text: `💰 You received ${reward} coins!` });
  },
  // More methods: work, gamble, shop, buy, etc.
};
