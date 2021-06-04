require('dotenv').config()
const express = require('express');
const app = express();
const server = require('http').Server(app);

// this is how socket knows what server to interact with
const io = require('socket.io')(server);

// this will take v4 and rename it
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    // send a message to that room
    // broadcast will send to everyone but the current user
    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
