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

app.get('/lobby', bearer,(req,res)=>{
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }
  res.render('lobby', {formattedUser});
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

app.get('/dashboard', bearer, (req,res)=>{
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
  // client.on('joinGame', joinGameHandler);
  
  function newGameHandler() {
    const roomCode = makeId(5);
    clientRooms[client.id] = roomCode;

    client.emit('roomCode', roomCode);

    // state[roomCode] = initGame()

    client.join(roomCode);
    client.number = 1;
    client.emit('init', 1)
  }
});




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