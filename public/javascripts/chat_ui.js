(function(root){
  var ChatApp = root.ChatApp = (root.ChatApp || {});

  var ChatUI = ChatApp.ChatUI = function(socket) {
    // needs to be public URL
    this.socket = io.connect('http://10.0.1.30:8080');
    this.chat = new ChatApp.Chat(this.socket);

    this.socket.on('message', function(data){
      $("<p>").text(data).prependTo($('.display-messages'));
    });

    this.socket.on('update-list', function(roomObj){
      console.log(roomObj);
      $('.buddy-list').empty();

      $.each(roomObj, function(roomName, roomBuddies){
        $('.buddy-list').append('<p>' + roomName + '</p>');
        roomBuddies.forEach(function(roomBuddy){
          $('.buddy-list').append('<li>' + roomBuddy + '</li>');
        });
      })
    })
  };

  ChatUI.prototype.getAndSendMessage = function() {
    var message = $('textarea').val();
    this.chat.sendMessage(message);
    $('textarea').val('');
  };
})(this);

$(document).ready(function() {
  window.chatUI = new ChatApp.ChatUI();

  $('textarea').blur(function(event){
    event.preventDefault();
    window.chatUI.getAndSendMessage();
  });
});