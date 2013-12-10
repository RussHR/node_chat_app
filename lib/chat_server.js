var createChat = function(server) {
  var io = require('socket.io').listen(server);
  var nicknames = {};
  var guestNumber = 1;

  io.sockets.on('connection', function(socket) {
    socket.guestID = guestNumber;
    socket.join('lobby');
    socket.currentRoom = 'lobby';
    socket.nickname = "Guest " + socket.guestID;

    nicknames[socket.currentRoom] = nicknames[socket.currentRoom] || []
    nicknames[socket.currentRoom].push(socket.nickname);
    guestNumber ++;
    io.sockets.emit('update-list', nicknames);

    socket.on('message', function(data) {
      if (data.message.substring(0, 6) === "/nick ") {
        var newNick = data.message.substring(6);

        if (nicknames[socket.currentRoom].indexOf(newNick) === -1 && newNick.substring(0,5) != "Guest") {
          io.sockets.in(socket.currentRoom).emit(
            'message', socket.nickname + " changed name to " + newNick
          );
          nicknames[socket.currentRoom].splice(nicknames[socket.currentRoom].indexOf(socket.nickname), 1);
          socket.nickname = newNick;
          nicknames[socket.currentRoom].push(newNick);

          io.sockets.emit('update-list', nicknames);
        }
        else {
          socket.emit('message', "Nickname isn't available");
        }
      }
      else if (data.message.substring(0, 6) === "/join "){
        nicknames[socket.currentRoom].splice(nicknames[socket.currentRoom].indexOf(socket.nickname), 1);
        socket.leave(socket.currentRoom);
        socket.currentRoom = data.message.substring(6);
        socket.join(socket.currentRoom);
        nicknames[socket.currentRoom] = nicknames[socket.currentRoom] || []
        nicknames[socket.currentRoom].push(socket.nickname);
        io.sockets.emit('update-list', nicknames);
      }
      else {
        io.sockets.in(socket.currentRoom).emit(
          'message', socket.nickname + ": " + data.message
        );
      }
    });

    socket.on('disconnect', function() {
      console.log("disconnecting...");
      nicknames[socket.currentRoom].splice(nicknames[socket.currentRoom].indexOf(socket.nickname), 1);
      io.sockets.in(socket.currentRoom).emit(
        'message', socket.nickname + " disconnected"
      );
      io.sockets.emit('update-list', nicknames);
    });
  });
};

module.exports.createChat = createChat;