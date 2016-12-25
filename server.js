var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var currentConnections = 0;
var currentUsers = [];
var len;


io.on('connection', function(socket) {
    currentConnections++;
    socket.userId = currentConnections;
    io.emit('users_count', currentConnections);
    io.emit('current-users', currentUsers);

    socket.on('username', function(name) {
        console.log('New user: ', name);
        socket.username = name;
        len = currentUsers.length;
        currentUsers[len] = {};
        currentUsers[len].name = socket.username;
        console.log(currentUsers);
        socket.broadcast.emit('new-user', socket.username);
        io.emit('current-users', currentUsers);
        socket.emit('getchat', len);
    });

    socket.on('typing', function() {
        var name = socket.username;
        socket.broadcast.emit('typing', name);
    });

    socket.on('message', function(message) {
        messageWithUsername = socket.username + ": " + message;
        console.log('Received message: ', messageWithUsername);
        socket.broadcast.emit('message', messageWithUsername);
    });

    socket.on('disconnect', function() {
        currentConnections--;
        for (var i = 0; i < currentUsers.length; i++) {
            if (currentUsers[i].name === socket.username) {
                console.log('Client disconnected', socket.username);
                currentUsers.splice(i, 1);
                io.emit('message', socket.username + ' has disconnected');
            }
        }
        io.emit('current-users', currentUsers);
        console.log(currentUsers);
        io.emit('users_count', currentConnections);
    });
});

server.listen(process.env.PORT || 8080);
console.log("Running on localhost:8080...");
