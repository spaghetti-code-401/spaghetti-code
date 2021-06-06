const socket = io('/');

let playerNumber;

// DOM elements
const newGameButton = document
  .getElementById('new-game-button')
  .addEventListener('click', newGameHandler);
const joinGameButton = document
  .getElementById('join-game-button')
  .addEventListener('click', joinGameHandler);
const roomCodeInput = document.getElementById('room-code-input');
const roomCodeDisplay = document.getElementById('room-code-display');

// Socket Listeners
socket.on('init', initHandler);
socket.on('roomCode', roomCodeHandler);
socket.on('unknownGame', unknownGameHandler);
socket.on('tooManyPlayers', tooManyPlayersHandler);

socket.on('gameState', gameStateHandler);

// Handlers
function newGameHandler(e) {
  e.preventDefault();

  socket.emit('newGame');
}
function joinGameHandler(e) {
  e.preventDefault();
  const roomCode = roomCodeInput.value;

  socket.emit('joinGame', roomCode);
}

function initHandler(payload) {
  playerNumber = payload;
}

function roomCodeHandler(roomCode) {
  // roomCodeDisplay.innerText = roomCode;
  roomCodeDisplay.textContent = roomCode;
}

function unknownGameHandler() {
  reset();
  alert('Unknown game code');
}
function tooManyPlayersHandler() {
  reset();
  alert('Game in progress');
}
function reset() {
  playerNumber = null;
  roomCodeInput.value = '';
  roomCodeDisplay.textContent = '';
}

// GAME STATE HANDLER
function gameStateHandler(payload) {
  alert(payload.msg)
  console.log(payload.msg)

  //// render game
}