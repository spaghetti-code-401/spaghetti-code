// Retrieve Elements
const consoleLogList = document.querySelector('.editor__console-logs');
const executeCodeBtn = document.querySelector('.editor__run');
const resetCodeBtn = document.querySelector('.editor__reset');

// Setup Ace
// takes the id of the container
let codeEditor = ace.edit('editorCode');
let defaultCode = `console.log('hello')`;
let consoleMessages = [];

// Object holding editor functions
let editorLib = {
  clearConsoleScreen() {
    consoleMessages.length = 0;

    // remove all elements in our custom console
    while (consoleLogList.firstChild) {
      // keep removing the first child until none are left
      consoleLogList.removeChild(consoleLogList.firstChild);
    }
  },
  printToConsole() {
    consoleMessages.forEach((log) => {
      const newLogItem = document.createElement('li');
      const newLogText = document.createElement('pre'); //pre-formatted text

      newLogText.className = log.class;
      newLogText.textContent = `> ${log.message}`;

      newLogItem.appendChild(newLogText);

      consoleLogList.appendChild(newLogItem);
    });
  },
  init() {
    // configure ace

    // theme
    codeEditor.setTheme('ace/theme/gob');
    /* Good Themes
    cobalt
    dracula
    gob
    monokai ??
    tomorrow_night_blue ??
    tomorrow_night_bright // dark with high contrast
    */

    // set language
    codeEditor.session.setMode('ace/mode/javascript');

    // set options
    // https://github.com/ajaxorg/ace/wiki/Configuring-Ace
    codeEditor.setOptions({
      fontFamily: 'Inconsolata', // or Monaco
      fontSize: '11pt',
      //  from src-min/ext-language_tools.js
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableEmmet: true,
      enableSnippets: true,
      wrap: true,
      useWrapMode: true,
      indentedSoftWrap: false,
    });

    // set default code
    codeEditor.setValue(defaultCode);
  }
};

// Events
executeCodeBtn.addEventListener('click', executeCodeBtnHandler);
function executeCodeBtnHandler() {
  // clear console messages
  editorLib.clearConsoleScreen();

  // get input from code editor
  let userCode = codeEditor.getValue();
  
  // run the user code
  try {
    new Function(userCode)();
  } catch (e) {
    console.error(e);
  }
  
  // print to our console
  editorLib.printToConsole();
};

resetCodeBtn.addEventListener('click', resetCodeBtnHandler)
function resetCodeBtnHandler() {
  // clear the Ace editor
  codeEditor.setValue('');

  // clear console messages
  editorLib.clearConsoleScreen();
};

// verifyCodeBtn.addEventListener('click', () => {
//   // clear console messages
//   editorLib.clearConsoleScreen();

//   // get input from code editor
//   let userCode = codeEditor.getValue();
//   userCode = userCode + 'console.log(add(5));console.log(add(10));'
  
//   // run the user code
//   try {
//     new Function(userCode)();
//   } catch (e) {
//     console.error(e);
//   }

//   verify();
  
//   // print to our console
//   editorLib.printToConsole();
// });

editorLib.init();

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