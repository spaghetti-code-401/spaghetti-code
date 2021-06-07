const socket = io('/');

let playerNumber, roomCode;

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
socket.on('initPlayerNumber', initPlayerNumberHandler);
socket.on('initRoomCode', initRoomCodeHandler);
socket.on('displayRoomCode', displayRoomCodeHandler);
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
  roomCode = roomCodeInput.value;

  socket.emit('joinGame', roomCode);
}

function initPlayerNumberHandler(payload) {
  playerNumber = payload;
}

function initRoomCodeHandler(payload) {
  roomCode = payload;
}

function displayRoomCodeHandler(roomCode) {
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
  showGameScreen();

  console.log('playerNumber', playerNumber)
  console.log('roomCode', roomCode)

  if(playerNumber === 2) {
    setReadOnly();
  }

  if (playerNumber === 1) {
    $(document).on('propertychange change click keyup input paste', onchangeHandler)
  }

  //// render game
}

function showGameScreen() {
  $('#game-screen').toggleClass('game-screen-visibility');
  $('#join-game-card').toggleClass('join-game-card-visibility');
}

function setReadOnly() {
  codeEditor.setReadOnly(true);
  executeCodeBtn.removeEventListener('click', executeCodeBtnHandler)
  resetCodeBtn.removeEventListener('click', resetCodeBtnHandler)
}

function onchangeHandler(e) {
  console.log(codeEditor.getValue())
  const editorCode = codeEditor.getValue();
  socket.emit('editorInputChange', {editorCode, roomCode})
}