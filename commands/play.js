const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  name: 'play',
  category: 'downloads',
  description: 'Play music from YouTube',
  usage: 'play <song name>',
  async execute(sock, msg, args) {
    if (!args.length) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Enter a song name.' });
    const query = args.join(' ');
    const result = await ytSearch(query);
    if (!result.videos.length) return sock.sendMessage(msg.key.remoteJid, { text: '❌ No results.' });
    const video = result.videos[0];
    const stream = ytdl(video.url, { filter: 'audioonly' });
    const file = path.join(__dirname, '../temp', `${Date.now()}.mp3`);
    stream.pipe(fs.createWriteStream(file));
    await new Promise(resolve => stream.on('end', resolve));
    await sock.sendMessage(msg.key.remoteJid, {
      audio: { url: file },
      mimetype: 'audio/mpeg',
      fileName: `${video.title}.mp3`,
    });
    fs.unlinkSync(file);
  }
};
