var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');

// Serve up public/ftp folder
var serve = serveStatic('./');

// Create server
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res);
  serve(req, res, done);
});

var port = 3333;

// Listen
server.listen(port);

console.log('Listening on port', port);
