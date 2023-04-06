const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
}); 

app.get('/:room', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-connected', userId);
    });
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
