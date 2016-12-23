var express = require('express');
var socket_io = require('socket.io');
var http = require('http');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var usersConnected = 0;
io.on('connection', function(socket) {
  usersConnected += 1;
  console.log('Client connected, ' + usersConnected + ' users here.');
  socket.broadcast.emit('connected');

  socket.on('disconnect', function(socket) {
    usersConnected -= 1;
    console.log('Client disconnected, ' + usersConnected + ' users here.');
    io.emit('disconnect');
  });

  socket.on('message', function(message) {
    console.log('Received message: ', message);
    socket.broadcast.emit('message', message); // sends msg to all clients connected.
  });
});



server.listen(process.env.PORT || 8080);
console.log("Running on localhost:8080...");
