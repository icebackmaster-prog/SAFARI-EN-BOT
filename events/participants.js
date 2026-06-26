const settings = require('../settings');
const logger = require('../lib/logger');

async function handleParticipants(sock, update) {
  const { id, participants, action } = update;
  const sett = settings.loadSettings();
  const meta = await sock.groupMetadata(id);
  const groupName = meta.subject;

  for (const participant of participants) {
    if (action === 'add') {
      if (sett.autoWelcome) {
        const msg = sett.welcomeMessage.replace(/@user/g, `@${participant.split('@')[0]}`).replace(/@group/g, groupName);
        await sock.sendMessage(id, { text: msg, mentions: [participant] });
      }
    } else if (action === 'remove') {
      if (sett.autoGoodbye) {
        const msg = sett.goodbyeMessage.replace(/@user/g, `@${participant.split('@')[0]}`);
        await sock.sendMessage(id, { text: msg, mentions: [participant] });
      }
    }
  }
}

module.exports = { handleParticipants };
