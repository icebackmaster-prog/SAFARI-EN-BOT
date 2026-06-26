const { DisconnectReason } = require('@whiskeysockets/baileys');
const logger = require('../lib/logger');

async function handleConnection(sock, update, startBot) {
  const { connection, lastDisconnect } = update;
  if (connection === 'close') {
    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
    logger.info('Connection closed. Reconnecting:', shouldReconnect);
    if (shouldReconnect) setTimeout(startBot, 5000);
  } else if (connection === 'open') {
    logger.info('Connected to WhatsApp');
    // Send start notification to owner
    const owner = global.config.owner + '@s.whatsapp.net';
    await sock.sendMessage(owner, { text: '✅ SAFARI EN is online!' });
  }
}

module.exports = { handleConnection };
