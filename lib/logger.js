// lib/logger.js
const pino = require('pino');

const logger = pino({
  level: 'info',
  // Simple output – no extra dependencies needed
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

module.exports = logger;
