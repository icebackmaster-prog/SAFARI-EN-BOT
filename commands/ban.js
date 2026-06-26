const db = require('../database');

module.exports = {
  name: 'ban',
  category: 'admin',
  description: 'Ban a user from the bot',
  usage: 'ban @user [reason]',
  async execute(sock, msg, args) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!quoted) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Mention a user.' });
    const reason = args.slice(1).join(' ') || 'No reason';
    const banned = db.banned.read();
    banned[quoted] = { reason, date: Date.now() };
    db.banned.write(banned);
    await sock.sendMessage(msg.key.remoteJid, { text: `🚫 @${quoted.split('@')[0]} banned. Reason: ${reason}` });
  }
};
