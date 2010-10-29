var SayClient = require('SayClient');

var SayApp = {
  addClient: function (client) {
    new SayClient(client);
  }
};

module.exports = SayApp;