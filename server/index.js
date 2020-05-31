var express = require('express')

var cors = require('cors')
var app = express()
var http = require('http').createServer(app);

var io = require('socket.io')(http);

var port = process.env.PORT || 4000
var socketPort = process.env.SOCKET_PORT || 4001

app.use(cors());
app.options('*', cors());

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(express.static(__dirname + '/public'));
app.listen(port);

http.listen(socketPort, () => {
  console.log(`listening on *:${socketPort}`);
});