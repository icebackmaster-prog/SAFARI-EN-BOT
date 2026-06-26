module.exports = {
  name: 'ping',
  category: 'info',
  description: 'Check bot latency',
  async execute(sock, msg) {
    const start = Date.now();
    await sock.sendMessage(msg.key.remoteJid, { text: '🏓 Pong!' });
    const end = Date.now();
    await sock.sendMessage(msg.key.remoteJid, { text: `*Latency:* ${end - start}ms` });
  }
};
