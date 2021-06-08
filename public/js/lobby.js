const socket = io('/');

let playerNumber, roomCode, globalEditorCodeResult;
const guessCodeBtn = document.getElementById('guess-button');

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
socket.on('receiveFirstPlayerSubmission', receiveFirstPlayerSubmissionHandler);
socket.on('guessInputUpdate', guessInputUpdateHandler);
socket.on('receiveSecondPlayerSubmission', receiveSecondPlayerSubmissionHandler);

socket.on('rematch', rematchHandler);

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

  console.log('playerNumber', playerNumber);
  console.log('roomCode', roomCode);

  if (playerNumber === 2) {
    setReadOnly();
  }

  if (playerNumber === 1) {
    $('#guess-input').prop('readonly', true);
    $(document).on(
      'propertychange change click keyup input paste',
      editorInputChangeHandler
    );
  }

  if (playerNumber === 2) {
    $('#guess-input').on(
      'propertychange change click keyup input paste',
      guessInputChangeHandler
    );
  }

  firstPlayerTimer();
}

function showGameScreen() {
  $('#game-screen').toggleClass('game-screen-visibility');
  $('#join-game-card').toggleClass('join-game-card-visibility');
}

function setReadOnly() {
  codeEditor.setReadOnly(true);
  executeCodeBtn.removeEventListener('click', executeCodeBtnHandler);
  resetCodeBtn.removeEventListener('click', resetCodeBtnHandler);
  // submitCodeBtn.addEventListener('click', submitCodeBtnHandler);
}

function editorInputChangeHandler(e) {
  // console.log(codeEditor.getValue())
  const editorCode = codeEditor.getValue();
  socket.emit('editorInputChange', { editorCode, roomCode });
}

function editorInputUpdateHandler(payload) {
  // console.log('EDITOR INPUT UPDATE', payload);
  if (playerNumber === 2) {
    codeEditor.setValue(payload);
    codeEditor.clearSelection();
  }
}

let firstTimerInterval;
function firstPlayerTimer() {
  // initializing both timers
  let timer = 60;
  $('#first-player-timer').text(timer);
  let secondPlayerTimer = 20;
  $('#second-player-timer').text(secondPlayerTimer);

  if (playerNumber === 1) {
    submitCodeBtn.addEventListener('click', submitCodeBtnHandler);
  }
  firstTimerInterval = setInterval(() => {
    timer--;
    $('#first-player-timer').text(timer);
    if (timer === 0) {
      submitCodeBtnHandler();
    }
  }, 1000);
}

function submitCodeBtnHandler(e) {
  clearInterval(firstTimerInterval);
  if (playerNumber === 1) {
    executeCodeBtnHandler();
    setReadOnly();
  }
  // get input from code editor
  // let editorCode = codeEditor.getValue();

  let editorCodeResult = consoleMessages[0];

  socket.emit('firstPlayerSubmission', { editorCodeResult, roomCode });
}

let secondTimerInterval;
function receiveFirstPlayerSubmissionHandler(payload) {
  if (playerNumber === 2) {
    clearInterval(firstTimerInterval);
  }

  // payload.message = payload.message.split(' ')[0]

  if (!payload.message && payload.message !== 0) {
    return violation('falsy');
  }

  // console.log('PAYLOAD', payload.message);
  console.log('PARSED PAYLOAD', JSON.parse(payload.message));

  // the following if statement to ignore strings without quotations (falsy)
  let parsedPayload;
  if (
    JSON.parse(payload.message)
    // typeof payload.message !== 'string' &&
    // typeof payload.message !== 'number'
  ) {
    parsedPayload = JSON.parse(payload.message);
  }
  if (typeof parsedPayload === 'boolean') return violation('boolean');
  if (typeof parsedPayload === 'function') return violation('function');
  if (typeof parsedPayload === 'object' && !Array.isArray(parsedPayload))
    return violation('object');
  if (typeof parsedPayload === 'object' && Array.isArray(parsedPayload))
    return violation('array');

  if (playerNumber === 2) {
    guessCodeBtn.addEventListener('click', guessCodeBtnHandler);
  }

  globalEditorCodeResult = payload.message;
  console.log('PAYLOAD.MESSAGE', globalEditorCodeResult)

  let timer = 20;
  secondTimerInterval = setInterval(() => {
    timer--;
    $('#second-player-timer').text(timer);
    if (timer === 0) {
      guessCodeBtnHandler();
    }
  }, 1000);

}

function guessCodeBtnHandler() {
  clearInterval(secondTimerInterval);
  // payload.message
  let answer = $('#guess-input').val();
  if (!isNaN(parseInt(answer))) {
    answer = parseInt(answer);
  }
  console.log('ANSWER', answer);
  // console.log(typeof answer == 'number');

  // to fix single quotations
  if (typeof answer !== 'number') {
    if (answer[0] === `'` || answer.includes(`'`)) {
      answer = answer.replace(/\'/g, `"`);
      console.log('FIXED ANSWER', answer);
    }
  }

  socket.emit('secondPlayerSubmission', { globalEditorCodeResult, answer, roomCode });
}

function receiveSecondPlayerSubmissionHandler(payload) {
  if (playerNumber === 1) {
    clearInterval(secondTimerInterval);
  }

  console.log('FINAL PAYLOAAAAAD', payload)
  
  if (payload.globalEditorCodeResult === payload.answer) {
    socket.emit('winner', { winner: 2, playerNumber, username: $('#header-username').text(), roomCode})
    if (playerNumber === 2) {
      alert(
        `🟢 CORRECT 😎 ---> output: ${payload.globalEditorCodeResult} === guess: ${payload.answer}`
      );
    } else if (playerNumber === 1) {
      alert(`🔴 WOOPSIE 😝 ---> they guessed it right`);
    }
  } else {
    socket.emit('winner', { winner: 1, playerNumber, username: $('#header-username').text(), roomCode})
    if (playerNumber === 2) {
      alert(
        `🔴 TSK TSK TSK 😢 ---> output: ${payload.globalEditorCodeResult} !== guess: ${payload.answer}`
      );
    } else if (playerNumber === 1) {
      alert(`🟢 LET'S GOOOO 🤓 ---> you riddled them well`);
    }
  }
}


function guessInputChangeHandler(e) {
  // console.log(codeEditor.getValue())
  const guessCode = $('#guess-input').val();
  socket.emit('guessInputChange', { guessCode, roomCode });
}

function guessInputUpdateHandler(payload) {
  // console.log('EDITOR INPUT UPDATE', payload);
  if (playerNumber === 1) {
    console.log(payload);
    $('#guess-input').val(payload);
  }
}

function violation(type) {
  socket.emit('winner', { winner: 2, playerNumber, username: $('#header-username').text(), roomCode})
  alert(`first player violation ---> output: ${type}`);
}

function rematchHandler(payload) {
  // showGameScreen();
  $('#guess-input').val('');
  codeEditor.setValue('');

  if (playerNumber === 1) {
    playerNumber = 2;
  } else {
    playerNumber = 1;
  }

  console.log('playerNumber', playerNumber);
  console.log('roomCode', roomCode);

  if (playerNumber === 2) {
    setReadOnly();
    submitCodeBtn.removeEventListener('click', submitCodeBtnHandler);
    $('#guess-input').prop('readonly', false);
    $('#guess-input').on(
      'propertychange change click keyup input paste',
      guessInputChangeHandler
    );
  }

  if (playerNumber === 1) {
    codeEditor.setReadOnly(false);
    $('#guess-input').prop('readonly', true);
    $(document).on(
      'propertychange change click keyup input paste',
      editorInputChangeHandler
    );
    executeCodeBtn.addEventListener('click', executeCodeBtnHandler);
    resetCodeBtn.addEventListener('click', resetCodeBtnHandler);
    guessCodeBtn.removeEventListener('click', guessCodeBtnHandler);
  }

  firstPlayerTimer();
}

