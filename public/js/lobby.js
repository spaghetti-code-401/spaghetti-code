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
socket.on('editorInputUpdate', editorInputUpdateHandler);

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
    $(document).on('propertychange change click keyup input paste', editorInputChangeHandler)
  }

  firstPlayerTimer();
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

function editorInputChangeHandler(e) {
  console.log(codeEditor.getValue())
  const editorCode = codeEditor.getValue();
  socket.emit('editorInputChange', {editorCode, roomCode})
}

function editorInputUpdateHandler(payload) {
  console.log('EDITOR INPUT UPDATE', payload);
  if (playerNumber === 2) {
    codeEditor.setValue(payload);
  }
}

let timerInterval;
function firstPlayerTimer() {
  let timer = 30;
  $('#first-player-timer').text(timer)
  submitCodeBtn.addEventListener('click', submitCodeBtnHandler)
  timerInterval = setInterval(() => {
    timer--;
    $('#first-player-timer').text(timer);
    if (timer === 0) {
      clearInterval(timerInterval);
      executeCodeBtnHandler();
    }
  }, 1000);
}

function submitCodeBtnHandler(e) {
  clearInterval(timerInterval);
  executeCodeBtnHandler();

  // get input from code editor
  let userCode = codeEditor.getValue();
  userCode = userCode + 'console.log(add(5));console.log(add(10));'
  
  // run the user code
  try {
    new Function(userCode)();
  } catch (e) {
    console.error(e);
  }

  verify();
  
  // print to our console
  editorLib.printToConsole();
};

function verify() {
  let output = [10, 20];

  while (consoleMessages.length > output.length) {
    consoleMessages.shift();
  }
  for (let i = 0; i < consoleMessages.length; i++) {
    if (consoleMessages[i].message === output[i]) {
      consoleMessages[i].message = `${consoleMessages[i].message}: Correct Answer`; 
    } else if (consoleMessages[i].message !== output[i]) {
      consoleMessages[i].message = `${consoleMessages[i].message}: False Answer`; 
    }

  }
}