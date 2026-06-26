const fs = require('fs-extra');
const path = require('path');
const logger = require('./lib/logger');

let commands = [];
let plugins = [];

function loadCommands() {
  const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
  commands = commandFiles.map(file => {
    const cmd = require(`./commands/${file}`);
    cmd.file = file;
    return cmd;
  });
  logger.info(`Loaded ${commands.length} commands`);
  return commands;
}

function loadPlugins() {
  const pluginFiles = fs.readdirSync('./plugins').filter(f => f.endsWith('.js'));
  plugins = pluginFiles.map(file => require(`./plugins/${file}`));
  logger.info(`Loaded ${plugins.length} plugins`);
  return plugins;
}

function getCommand(name) {
  return commands.find(cmd => cmd.name === name || (cmd.aliases && cmd.aliases.includes(name)));
}

function getAllCommands() {
  return commands;
}

function getAllPlugins() {
  return plugins;
}

module.exports = { loadCommands, loadPlugins, getCommand, getAllCommands, getAllPlugins };