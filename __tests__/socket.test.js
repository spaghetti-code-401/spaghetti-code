'use strict';

// const { createServer } = require('http');
// const { Server } = require('socket.io');
const Client = require('socket.io-client');

const { io, ioServer } = require('../src/server');
// const { makeId } = require('../src/utils/makeId');

// from jest documentation
describe(`I can't find my socks`, () => {
  let serverSocket, clientSocket;

  beforeAll(done => {
    // const httpServer = createServer();
    // io = new Server(httpServer);
    ioServer.listen(() => {
      const port = ioServer.address().port;
      console.log('PORT ------->', port);
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', socket => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });  

  // test('#newGame', done => {
  //   // const handler = jest.fn();
  //   serverSocket.on('newGame', arg => {
  //     expect(arg).toBe(1);
  //     // done();
  //   });
  //   clientSocket.emit('newGame', 1);
  // });

  test('#initPlayerNumber', done => {
    clientSocket.on('initPlayerNumber', arg => {
      expect(arg).toBe(1);
      done();
    });
    serverSocket.emit('initPlayerNumber', 1);
  });

  // test('#rematch', done => {
  //   clientSocket.on('rematch', arg => {
  //     expect(arg).toBe(150);
  //     done();
  //   });
  //   serverSocket.emit('rematch', 150);
  // });
});