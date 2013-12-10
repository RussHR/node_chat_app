var fs = require('fs');

var router = function(request, response) {
  if (request.url === "/") {
    fs.readFile("public/index.html", function(err, contents) {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(contents);
      response.end();
    });
  }
  else {
    fs.readFile('public' + request.url, function(err, contents) {
      if (err && request.url !== "/favicon.ico") {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end();
      } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(contents);
        response.end();
      }
    });
  }
};

module.exports.router = router;