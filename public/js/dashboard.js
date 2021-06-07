const socket = io('/');

socket.emit('log', {msg: 'testing123'});