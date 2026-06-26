const config = require('./config');
const fs = require('fs-extra');
const path = require('path');
const logger = require('./lib/logger');

let db = {};

if (config.database.type === 'mongo') {
  const mongoose = require('mongoose');
  mongoose.connect(config.database.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  const User = mongoose.model('User', new mongoose.Schema({ jid: String, data: {} }));
  const Group = mongoose.model('Group', new mongoose.Schema({ jid: String, data: {} }));
  // ... other models
  db = { User, Group };
} else {
  // JSON storage
  const dataDir = path.join(__dirname, 'database');
  fs.ensureDirSync(dataDir);

  const files = ['users', 'groups', 'premium', 'banned', 'warnings', 'economy', 'levels', 'settings'];
  files.forEach(f => {
    const filePath = path.join(dataDir, `${f}.json`);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
    db[f] = {
      read: () => JSON.parse(fs.readFileSync(filePath)),
      write: (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2)),
      get: (key) => {
        const data = db[f].read();
        return data[key];
      },
      set: (key, value) => {
        const data = db[f].read();
        data[key] = value;
        db[f].write(data);
      },
      delete: (key) => {
        const data = db[f].read();
        delete data[key];
        db[f].write(data);
      },
      all: () => db[f].read(),
    };
  });
}

module.exports = db;