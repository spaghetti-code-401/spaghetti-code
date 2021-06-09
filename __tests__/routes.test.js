'use strict';

require('@code-fellows/supergoose');

const serverPage = require('../src/server');
const superTest = require('supertest');
const mockServer = superTest(serverPage.server);

describe('::: LOGIN ::::', () => {
  it('#opens home page', async () => {
    const result = await mockServer.get('/');

    expect(result.status).toEqual(200);
  });

  it('#denies not logged in users', async () => {
    const result = await mockServer.get('/dashboard');

    expect(result.status).toEqual(500);
  });

  it('#404 handler', async () => {
    const result = await mockServer.get('/guess');

    expect(result.status).toEqual(404);
  });

  it('#login', () => {

    return mockServer.post('/test-token').send({
      email: 'batteekh@email.com',
      password: '12345678'
    }).then(data => {
      console.log('TOKEN:::::::::::::::::', data.body.token);
      return mockServer
        .get('/editor')
        .set('Cookie', [
          `auth-token=${data.body.token}`
        ])
        .then((result) => {
          expect(result.status).toEqual(200);
        });
    });
  });
});

