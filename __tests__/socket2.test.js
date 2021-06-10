'use strict';

const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');

const { makeId } = require('../src/utils/makeId');

let socket, httpServer, httpServerAddr, ioServer;

// setup
beforeAll(done => {
  httpServer = http.createServer();
  httpServerAddr = httpServer.listen().address();
  ioServer = ioBack(httpServer);
  done();
});

// cleanup
afterAll(done => {
  ioServer.close();
  httpServer.close();
  done();
});

// testing setup
beforeEach(done => {
  // do not hard code server port and address, square brackets are used of IPv6
  socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  done();
  
});

// testing cleanup
afterEach(done => {
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});

describe('basic socket.io example', () => {
  
  test('should communicate', done => {
    // once connected, emit Hello Y'all
    socket.on('connect', () => {
      socket.once('echo', message => {
        console.log(message);
        expect(message).toBe(`Hello Y'all`);
        done();
      });
    });
  
    ioServer.on('connection', client => {
      client.emit('echo', `Hello Y'all`);
      console.log('LOGGGGGGGGGGGGGGGGGGGGGGGGG', client.id);
      expect(client).toBeDefined();
    });
  });
  
  test('#newGame', done => {
    // once connected, emit Hello Y'all
    socket.on('connect', () => {
      socket.emit('newGame');
      done();
    });
  
    ioServer.on('connection', client => {
      console.log('LOGGGGGGGGGGGGGGGGGGGGGGGGG', client.id);
      client.on('newGame', () => {
        
      });
      expect(client).toBeDefined();
    });
  });
  
  
});