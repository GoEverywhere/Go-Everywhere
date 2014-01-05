var WebSocket = require('faye-websocket'),
    http      = require('http');

var history = [ ];
var clients = [ ];
var idIndex = [ ];

var server = http.createServer();

server.addListener('upgrade', function(request, socket, head) {
  var ws = new WebSocket(request, socket, head);
  var id = idIndex.push(clients.push(ws) - 1) - 1;
  console.log('client '+id+' connected');

  ws.onmessage = function(event) {
    for (i=0;i<clients.length;i++) { if (i != idIndex[id]) clients[i].send(event.data); }
  };

  ws.onclose = function(event) {
    console.log('client '+id+' disconnected');
    clients.splice(idIndex[id], 1);
    for (i=0;i<idIndex.length;i++) { if (idIndex[i] > idIndex[id]) idIndex[i] -= 1; }
    ws = null;
  };
});

server.listen(50234);
console.log("server up on port 50234");