require.paths.push(__dirname + '/lib');
require.paths.push(__dirname + '/lib/vendor');

var express = require('express'),
    io      = require('socket.io'),
    SayApp  = require('SayApp'),
    app     = express.createServer();

app.configure(function () {
  app.use(express.staticProvider('public')); 
}).listen(8080);

io.listen(app).on('connection', SayApp.addClient);

