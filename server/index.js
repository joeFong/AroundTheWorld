var express = require('express')

var cors = require('cors')
var app = express()
var http = require('http').createServer(app);

var io = require('socket.io')(http);

var port = process.env.PORT || 4000
var socketPort = process.env.SOCKET_PORT || 4001
var socketsArray = [];

app.use(cors());
app.options('*', cors());

io.on('connection', (socket) => {
  socket.broadcast.emit('add-users', {
    users: [socket.id]
  });

  socket.on('make-offer', function (data) {
    socket.to(data.to).emit('offer-made', {
      offer: data.offer,
      socket: socket.id
    });
  });

  socket.on('make-answer', function (data) {
    socket.to(data.to).emit('answer-made', {
      socket: socket.id,
      answer: data.answer
    });
  });

  socket.on('disconnect', () => {
    this.socketsArray.splice(this.socketsArray.indexOf(socket.id), 1);
    this.io.emit('remove-user', socket.id);
  });
  
});

app.use(express.static(__dirname + '/public'));
app.listen(port);

http.listen(socketPort, () => {
  console.log(`listening on *:${socketPort}`);
});