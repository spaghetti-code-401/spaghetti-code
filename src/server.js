'use strict';

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

const oauth = require('../src/middleware/oauth')
const bearer = require('../src/middleware/bearer')
const homeBearer = require('../src/middleware/home-bearer')
const challengeRoute=require('./routes/challenges')
const leaderboardRoute=require('./routes/leaderboard')
const randomRoute=require('./routes/getRandom')
const userRoute=require('./routes/users')


const userModel = require('./models/user')

const { makeId } = require('./utils/makeId')


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(express.static('public'));

// socket
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', homeBearer, (req,res)=>{
 res.status(200).render('home')
})

app.get('/oauth', oauth, (req, res) => {
  res.cookie('auth-token', req.token)
  res.status(200).redirect('/dashboard')
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
  res.status(200).render('lobby', { formattedUser });
})

app.get('/editor', bearer,(req,res)=>{
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }
  res.status(200).render('editor', {formattedUser});
})

app.get('/dashboard', bearer, (req ,res) => {
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }

  res.status(200).render('dashboard', {formattedUser});
})

// app.get('/admin',bearer,(req,res)=>{
//   let user = req.user;
//   let formattedUser = {
//     username: user.username,
//     score: user.score,
//     avatar_url: user.avatar_url
//   }
//   req.statusCode(201).json()
// })

app.get('/logout',(req,res)=>{
  res.cookie("auth-token","")
  res.redirect('/')
})

app.post('/test-token', async (req, res) => {

  let userRecord = {
    username: req.body.email,
    password: 'oauth',
    avatar_url: 'test',
    bio: 'test', 
    role: 'admin'
  };
  let token = jwt.sign({ username: userRecord.username }, process.env.SECRET);
  
  userRecord.token = token;
  const check = jwt.verify(userRecord.token, process.env.SECRET);
  const result = await userModel.findOne({ username: check.username });
  let user;
  if (result) {
    user = result;
  } else {
    let newUser = new userModel(userRecord);
    user = await newUser.save();
  }
  
  res.status(201).json({token});
})

app.use(challengeRoute);
app.use(leaderboardRoute);
app.use(randomRoute);
app.use(userRoute)
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
  client.on('firstPlayerSubmission', firstPlayerSubmissionHandler);
  client.on('guessInputChange', guessInputChangeHandler);
  client.on('secondPlayerSubmission', secondPlayerSubmissionHandler);
  client.on('winner', winnerHandler);

  // we kept it here to access the client object
  // to send the rematch event to the client alone
  // because sending it back to the whole room will cause
  // duplication in the event
  async function winnerHandler(payload) {
    // payload.winner
    // payload.playerNumber
    // payload.username
    console.log('MONGOOSE --------------', payload);
  
    if (payload.winner === payload.playerNumber) {
      // WINNER -> increase username score
      let user = await userModel.findOneAndUpdate({
        username: payload.username
      }, {$inc: {score: 50}}, {
        new: true
      });
      console.log('WINNER USER --->', user)
    }
    if (payload.winner !== payload.playerNumber) {
      // LOSER -> decrease username score
      let user = await userModel.findOneAndUpdate({
        username: payload.username
      }, {$inc: {score: -25}}, {
        new: true
      });
      console.log('LOSER USER --->', user)
    }

    let user = await userModel.findOne({username: payload.username});
    let score = user.score;
    
    // this will emit rematch twice for each user, unwanted behavior
    // io.sockets.broadcast.to(payload.roomCode).emit('rematch', payload);

    // this will emit rematch once 
    client.emit('rematch', score);
  }
});

function gameHandler(roomCode) {
  io.sockets.in(roomCode).emit('gameState', { msg: 'game Started!!' })
}

function editorInputChangeHandler(payload) {
  // console.log(payload.editorCode);
  // console.log(payload.roomCode);
  io.sockets.to(payload.roomCode).emit('editorInputUpdate', payload.editorCode)
}

function firstPlayerSubmissionHandler(payload) {
  io.sockets.to(payload.roomCode).emit('receiveFirstPlayerSubmission', payload.editorCodeResult);
};

function guessInputChangeHandler(payload) {
  console.log(payload.editorCode);
  console.log(payload.roomCode);
  io.sockets.to(payload.roomCode).emit('guessInputUpdate', payload.guessCode)
}

function secondPlayerSubmissionHandler(payload) {
  io.sockets.to(payload.roomCode).emit('receiveSecondPlayerSubmission', payload);
};

// ERROR HANDLERS
app.use('*', notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  startup: (port) => {
    server.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};