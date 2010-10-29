function IoClient (client) {

  client.on('message',    this.handleMessage.bind(this));
  client.on('disconnect', this.handleDisconnect.bind(this));

  this.send = function (data) {
    client.send(data);
  };
  
  this.broadcast = function (data) {
    client.broadcast(data);
  };
  
  this.handleConnect();
}

IoClient.prototype.handleConnect = function () {};
IoClient.prototype.handleMessage = function () {};
IoClient.prototype.handleDisconnect = function () {};
IoClient.prototype.broadcastAll = function (data) {
  this.broadcast(data);
  this.send(data);
};

module.exports = IoClient;