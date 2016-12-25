$(document).ready(function() {
    var socket = io();
    var messageInput = $('#message');
    var usernameInput = $('#username');
    var messages = $('#messages');
    var connections = $('#connections');

    var addMessage = function(messageWithUsername) {
        messages.append('<div class="messageColor">' + messageWithUsername + '</div>');
    };

    var addUsername = function(name) {
        socket.emit('username', name);
    };

    var displayCount = function(count) {
        connections.html('<p>There are ' + count + ' users here!</p>');
    };

    var userTyping = function(user) {
        $('#activity').html(user + ' is typing...');
        setTimeout(function() {
            $('#activity').html('');
        }, 3000);
    };

    var newUser = function(name) {
        messages.html('');
        messages.append('<div id="notification">User ' + name + ' is now connected</div>');
        $('#notification').fadeOut(4000);
    };

    var updateUsers = function(users) {
        $('#current-users').html('');
        users.forEach(function(e) {
            if(users.length === 0) {
                return;
            } else {
                $('#current-users').append('<p>' + e.name + ' is ready to chat</p>');
            }
        })
    };

    var getChatBox = function(test) {
        $('#username').fadeOut('slow', function() {
            $('#message').fadeIn('slow');
        });
    };

    usernameInput.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        var username = usernameInput.val();
        addUsername(username);
        usernameInput.val('');
    });

    messageInput.on('keydown', function(event) {
        if (event.keyCode != 13) {
            socket.emit('typing', socket.username);
            return;
        }

        var message = messageInput.val();
        addMessage(message);
        socket.emit('message', message);
        socket.emit('stopped');
        messageInput.val('');
    });
    socket.on('typing', userTyping);
    socket.on('new-user', newUser);
    socket.on('current-users', updateUsers);
    socket.on('users_count', displayCount);
    socket.on('message', addMessage);
    socket.on('getchat', getChatBox);
});
