module.exports = {
  name: 'tagall',
  category: 'admin',
  description: 'Mention all group members',
  async execute(sock, msg) {
    if (!msg.key.remoteJid.endsWith('@g.us')) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Group only.' });
    const groupMeta = await sock.groupMetadata(msg.key.remoteJid);
    const participants = groupMeta.participants.map(p => p.id);
    let text = '📢 *Attention all members!*\n';
    participants.forEach(p => text += `@${p.split('@')[0]} `);
    await sock.sendMessage(msg.key.remoteJid, { text, mentions: participants });
  }
};
