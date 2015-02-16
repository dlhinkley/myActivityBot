var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app);
var EurecaServer = require('eureca.io').EurecaServer;
 
var eurecaServer = new EurecaServer();
 
eurecaServer.attach(server);
 
 
//functions under "exports" namespace will be exposed to client side
eurecaServer.exports.hello = function () {
    console.log('Hello from client');
}
//------------------------------------------
 
//see browser client side code for index.html content
app.get('/', function (req, res, next) {
    res.sendfile('index.html');
});
app.get('/node_modules/eureca.io/lib/EurecaClient.js', function (req, res, next) {
    res.sendfile('node_modules/eureca.io/lib/EurecaClient.js');
});
server.listen(process.env.PORT, process.env.IP);