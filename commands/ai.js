const { OpenAI } = require('openai');
const config = require('../config');

const openai = new OpenAI({ apiKey: config.apiKeys.openai });

module.exports = {
  name: 'ai',
  aliases: ['gpt', 'chatgpt'],
  category: 'ai',
  description: 'Chat with AI',
  usage: 'ai <text>',
  async execute(sock, msg, args) {
    if (!args.length) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Please provide a prompt.' });
    const prompt = args.join(' ');
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      });
      const reply = response.choices[0].message.content.trim();
      await sock.sendMessage(msg.key.remoteJid, { text: `🤖 *AI:* ${reply}` });
    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ AI error: ' + err.message });
    }
  }
};
