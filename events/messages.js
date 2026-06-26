const { loadCommands, getCommand, loadPlugins } = require('../handler');
const settings = require('../settings');
const config = require('../config');
const logger = require('../lib/logger');

// Load commands once
let commands = loadCommands();
let plugins = loadPlugins();

async function handleMessages(sock, m, store) {
  const msg = m.messages[0];
  if (!msg.message) return;
  const sender = msg.key.remoteJid;
  const fromMe = msg.key.fromMe;
  const isGroup = sender.endsWith('@g.us');

  // Auto-read
  const sett = settings.loadSettings();
  if (sett.autoRead && !fromMe) {
    await sock.readMessages([msg.key]);
  }

  // Ignore own messages unless testing
  if (fromMe) return;

  // Extract text
  let text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
  if (!text) return;

  // Check prefix
  const prefix = config.prefix;
  if (!text.startsWith(prefix)) return;
  const args = text.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Find command
  const cmd = getCommand(commandName);
  if (!cmd) return;

  // Check if user is banned
  const banned = global.db.banned.read();
  if (banned[sender]) {
    return sock.sendMessage(sender, { text: '⛔ You are banned from using this bot.' });
  }

  // Execute command
  try {
    await cmd.execute(sock, msg, args);
    logger.info(`Command ${commandName} executed by ${sender}`);
  } catch (err) {
    logger.error(`Error in ${commandName}:`, err);
    await sock.sendMessage(sender, { text: '❌ An error occurred while executing the command.' });
  }
}

module.exports = { handleMessages };
