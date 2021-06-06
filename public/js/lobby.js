const socket = io('/');

let playerNumber;

// DOM elements
const newGameButton = document
  .getElementById('new-game-button')
  .addEventListener('click', newGameHandler);
const joinGameButton = document
  .getElementById('join-game-button')
  .addEventListener('click', joinGameHandler);
const roomCode = document.getElementById('room-code-input').value;
const roomCodeDisplay = document.getElementById('room-code-display');

// Socket Listeners
socket.on('init', initHandler);
socket.on('roomCode', roomCodeHandler);




// Handlers
function newGameHandler(e) {
  e.preventDefault();

  socket.emit('newGame');
}
function joinGameHandler(e) {
  e.preventDefault();

  socket.emit('joinGame', roomCode);
}

function initHandler(payload) {
  playerNumber = payload;
}

function roomCodeHandler(roomCode) {
  roomCodeDisplay.innerText = roomCode;
}