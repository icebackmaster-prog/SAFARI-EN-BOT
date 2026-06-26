const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  name: 'sticker',
  aliases: ['s'],
  category: 'tools',
  description: 'Create sticker from image/video',
  async execute(sock, msg) {
    const m = msg.message;
    if (!m.imageMessage && !m.videoMessage) {
      return sock.sendMessage(msg.key.remoteJid, { text: '❌ Reply to an image or video.' });
    }
    const media = await downloadMediaMessage(m, 'buffer', {}, {});
    const tmp = path.join(__dirname, '../temp', `${Date.now()}.webp`);
    await sharp(media).resize(512, 512).toFile(tmp);
    await sock.sendMessage(msg.key.remoteJid, { sticker: { url: tmp } });
    fs.unlinkSync(tmp);
  }
};
