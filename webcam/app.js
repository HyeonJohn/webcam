const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('join-room', (roomId) => {
    const roomClients = io.sockets.adapter.rooms.get(roomId) || new Set();
    const numberOfClients = roomClients.size;

    if (numberOfClients < 2) {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      if (numberOfClients === 1) {
        socket.to(roomId).emit('start-call', socket.id);
      }
    } else {
      socket.emit('room-full', roomId);
    }
  });

  socket.on('webrtc_offer', (event) => {
    socket.to(event.peerSocketId).emit('webrtc_offer', event.sdp);
  });

  socket.on('webrtc_answer', (event) => {
    socket.to(event.peerSocketId).emit('webrtc_answer', event.sdp);
  });

  socket.on('webrtc_ice_candidate', (event) => {
    socket.to(event.peerSocketId).emit('webrtc_ice_candidate', event);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
