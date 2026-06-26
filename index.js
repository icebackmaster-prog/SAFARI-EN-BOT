require('dotenv').config();
const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore, DisconnectReason } = require('@whiskeysockets/baileys');
const Pino = require('pino');
const { handleConnection, handleMessages, handleParticipants } = require('./events');
const config = require('./config');
const logger = require('./lib/logger');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version, isLatest } = await fetchLatestBaileysVersion();

  const store = makeInMemoryStore({ logger: Pino().child({ level: 'silent' }) });
  store.readFromFile('./session/store.json');
  setInterval(() => store.writeToFile('./session/store.json'), 60_000);

  const sock = makeWASocket({
    version,
    auth: state,
    logger: Pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['SAFARI EN', 'Chrome', '1.0.0'],
    getMessage: async (key) => store.loadMessage(key.remoteJid, key.id)?.message,
  });

  store.bind(sock.ev);

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    await handleConnection(sock, update, startBot);
  });

  sock.ev.on('messages.upsert', async (m) => {
    await handleMessages(sock, m, store);
  });

  sock.ev.on('group-participants.update', async (update) => {
    await handleParticipants(sock, update);
  });

  // Additional event handlers from events folder
  require('./events/group')(sock);
  require('./events/welcome')(sock);
  require('./events/goodbye')(sock);
  require('./events/call')(sock);

  global.sock = sock;
  global.store = store;
  global.db = require('./database');
  global.config = config;
  logger.info('SAFARI EN is online!');
}

startBot().catch((err) => {
  logger.error('Failed to start bot:', err);
  process.exit(1);
});