$(document).ready(function() {
  var input = $('input');
  var messages = $('#messages');
  var socket = io();

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

  var broadcastConnected = function() {
    $('#connected').append('<p id="user">New user connected. </p>');
    // $('#connected').appened('<p id="numOfUsers">'+ usersConnected + ' people here!</p>');
    // console.log(usersConnected);
    setTimeout(function(){
      if ($('#user').length > 0) {
        $('#user').remove();
        // $('#numOfUsers').remove();
      }
    }, 2000);
  };

  var broadcastDisconnect = function() {
    $('#connected').append('<p id="user">User disconnected</p>');
    setTimeout(function(){
      if ($('#user').length > 0) {
        $('#user').remove();
      }
    }, 2000);
  };

  socket.on('message', addMessage);
  socket.on('connected', broadcastConnected);
  socket.on('disconnect', broadcastDisconnect);
});
