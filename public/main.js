$(document).ready(function() {
  var input = $('input');
  var messages = $('#messages');
  var connected = $('#connected');
  var user = $('#user');
  var numOfUsers = $('numOfUsers');
  var activeConnections = $('#activeConnections');
  var socket = io();

  // var usersConnected = 0;
  var addMessage = function(message) {
    messages.append('<div>' + message + '</div>')
  };

  input.on('keydown', function(event) {
    if(event.keyCode != 13){
      return;
    }

    var message = input.val();
    addMessage(message);
    socket.emit('message', message);
    input.val('');
  });

  var broadcastConnection = function() {
    connected.append('<p id="user">New user connected. </p>');
    setTimeout(function(){
      if (user.length > 0) {
        user.remove();
        numOfUsers.remove();
      }
    }, 3000);
  };

  var broadcastDisconnect = function() {
    connected.append('<p id="user">User disconnected.</p>');
    setTimeout(function(){
      if (user.length > 0) {
        user.remove();
      }
    }, 2000);
  };

  var displayCount = function(count) {
    activeConnections.html('<p>There are ' + count +' active users.</p>');
  };

  socket.on('message', addMessage);
  socket.on('connected', broadcastConnection);
  socket.on('disconnect', broadcastDisconnect);
  socket.on('user_count', displayCount);
});
