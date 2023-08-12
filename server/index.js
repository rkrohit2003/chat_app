const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user-joined', (userName) => {
    users[socket.id] = userName;
    socket.broadcast.emit('user-joined', userName);
  });
  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, userName: users[socket.id] });
  });
  socket.on('disconnect', (message) => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
