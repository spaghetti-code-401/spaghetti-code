// Retrieve Elements
const consoleLogList = document.querySelector('.editor__console-logs');
const executeCodeBtn = document.querySelector('.editor__run');
const resetCodeBtn = document.querySelector('.editor__reset');
const verifyCodeBtn = document.querySelector('.editor__verify');

// Setup Ace
// takes the id of the container
let codeEditor = ace.edit('editorCode');
// let defaultCode = `// awesome code below;console.log('🏃 for your life!');`;
// for (let i = 0; i < 10; i++) {
//   defaultCode = defaultCode + defaultCode;
// }
let defaultCode = minifiedDefaultCode();
let defaultCodeArray = defaultCode.split('');
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
  setDefault() {
    let renderedArray = [];
    setInterval(() => {
      if (defaultCodeArray.length) {
        let letter = defaultCodeArray.shift();
        renderedArray.push(letter);
        let renderedCode = renderedArray.join('');
        codeEditor.setValue(renderedCode);
        codeEditor.clearSelection();
      }
    }, 25);
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
      fontSize: '14pt',
      //  from src-min/ext-language_tools.js
      // enableBasicAutocompletion: true,
      // enableLiveAutocompletion: true,
      // enableEmmet: true,
      // enableSnippets: true,
      wrap: true,
      useWrapMode: true,
      indentedSoftWrap: false
    });

    // set default code
    this.setDefault();
  }
};

editorLib.init();

function minifiedDefaultCode() {
  return (
    `const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';const destination = 'spaghetti-code';const authors = ['ali sartawi','ahmad abu yahya','haneen zyad','qais ata'];const deadline = 'yesterday';`
  );
}