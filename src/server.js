'use strict';

const express = require('express');
const app = express();

const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

const oauth = require('../src/middleware/oauth')
const bearer = require('../src/middleware/bearer')

const { makeId } = require('./utils/makeId')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(express.static('public'));

// socket
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/',(req,res)=>{
 res.render('home')
})
app.get('/oauth', oauth, (req, res) => {
  res.cookie('auth-token', req.token)
  res.redirect('/dashboard')
})
app.get('/guess', bearer,(req,res)=>{
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }
  res.render('guess', {formattedUser});
})
app.get('/lobby', bearer,(req,res)=>{
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }
  // API comment
  // res.json(formattedUser);
  res.render('lobby', { formattedUser });
})

app.get('/editor', bearer,(req,res)=>{
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }
  res.render('editor', {formattedUser});
})

app.get('/dashboard', bearer, (req ,res) => {
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }

  res.render('dashboard', {formattedUser});
})

// -------------SOCKET-------------
const clientRooms = {}

io.on('connection', client => {
  console.log('CLIENT ID: ', client.id);
  // console.log('CLIENT: ', client.nsp.sockets);
  client.on('log', payload => {
    console.log('LOG', payload.msg)
  });

  client.on('newGame', newGameHandler);
  function newGameHandler() {
    const roomCode = makeId(5);
    clientRooms[client.id] = roomCode;

    client.emit('displayRoomCode', roomCode);

    // state[roomCode] = initGame()

    client.join(roomCode);
    
    const room = io.sockets.adapter.rooms.get(roomCode);
    // console.log('AFTER first player joined game', io.sockets.adapter.rooms)
    console.log('AFTER first player joined game', room)

    client.number = 1;
    client.emit('initPlayerNumber', 1)
    client.emit('initRoomCode', roomCode)
  }

  client.on('joinGame', joinGameHandler);
  function joinGameHandler(roomCode) {
    const room = io.sockets.adapter.rooms.get(roomCode);
    // const room = io.sockets.adapter.rooms;
    // console.log('room', room);
    // console.log('roomCode', roomCode);

    let players;
    if (room) players = room.size; // similar to array.length

    if (players === 0 || !players) {
      client.emit('unknownGame');
      return;
    } else if (players > 1) {
      client.emit('tooManyPlayers');
      return;
    }

    clientRooms[client.id] = roomCode;
    // console.log('BEFORE player 2', room.size)
    client.join(roomCode);
    // console.log('AFTER player 2', room.size)
    client.number = 2;
    client.emit('initPlayerNumber', 2);
    client.emit('initRoomCode', roomCode);

    gameHandler(roomCode);
  }

  client.on('editorInputChange', editorInputChangeHandler);
});

function gameHandler(roomCode) {
  io.sockets.in(roomCode).emit('gameState', { msg: 'game Started!!' })
}

function editorInputChangeHandler(payload) {
  console.log(payload.editorCode);
  console.log(payload.roomCode);
  io.sockets.in(payload.roomCode).emit('editorInputUpdate', payload.editorCode)
}




// ERROR HANDLERS
app.use('*', bearer, notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  startup: (port) => {
    server.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};