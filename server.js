var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var appRouter = require('./router.js');
var chatServer = require('./lib/chat_server.js');

var app = http.createServer(function(request, response) {
  appRouter.router(request, response);
});

app.listen(8080);
chatServer.createChat(app);

