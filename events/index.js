// events/index.js
module.exports = {
  handleConnection: require('./connection').handleConnection,
  handleMessages: require('./messages').handleMessages,
  handleParticipants: require('./participants').handleParticipants,
};
