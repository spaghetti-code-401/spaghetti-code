let console = (function (oldConsole) {
    return {
      formArgsOutput: function (arg) {
        let outputArgMessage;
  
        // deal with different primitive types
        switch (this.getType(arg)) {
          case 'string':
            outputArgMessage = `"${arg}"`;
            break;
          case 'object':
            outputArgMessage = `Object '${JSON.stringify(arg)}'`;
            break;
          case 'array':
            outputArgMessage = `Array '${JSON.stringify(arg)}'`;
            break;
          default:
            outputArgMessage = arg;
            break;
        }
  
        return outputArgMessage;
      },
      logMultipleArgs: function (args) {
        let currentLog = '';
  
        // deal with multiple arguments
        args.forEach((arg) => {
          // a space in the end is like a spacing between each log
          currentLog += this.formArgsOutput(arg) + ' ';
        });
  
        // use apply to make it run multiple arguments properly
        oldConsole.log.apply(oldConsole, args);
  
        consoleMessages.push({
          message: currentLog,
          // type is default because it's a big string with different arguments
          class: `log log--default`
        });
  
        oldConsole.log(consoleMessages);
      },
      getType: function (arg) {
        if (typeof arg === 'string') return 'string';
        if (typeof arg === 'boolean') return 'boolean';
        if (typeof arg === 'function') return 'function';
        if (typeof arg === 'number') return 'number';
        if (typeof arg === 'undefined') return 'undefined';
        if (typeof arg === 'object' && !Array.isArray(arg)) return 'object';
        if (typeof arg === 'object' && Array.isArray(arg)) return 'array';
      },
      logSingleArg: function (logItem) {
        oldConsole.log(logItem);
        consoleMessages.push({
          message: this.formArgsOutput(logItem),
          class: `log log--${this.getType(logItem)}`
        });
  
        oldConsole.log(consoleMessages);
      },
      log: function (text) {
        let argsArray = Array.from(arguments); // arguments is built in variable
        oldConsole.log('arguments', argsArray);
        return argsArray.length !== 1
          ? this.logMultipleArgs(argsArray)
          : this.logSingleArg(text);
      },
      info: function (text) {
        oldConsole.info(text);
      },
      warn: function (text) {
        oldConsole.warn(text);
      },
      error: function (err) {
        oldConsole.error(err);
        consoleMessages.push({
          message: `${err.name}: ${err.message}`,
          class: 'log log--error'
        });
      }
    };
  })(window.console);