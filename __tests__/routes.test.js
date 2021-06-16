'use strict';

require('@code-fellows/supergoose');

const serverPage = require('../src/server');
const superTest = require('supertest');
const mockServer = superTest(serverPage.server);

const challenge = {
  name:  'getMaxNode'   ,
  starterCode: 'getMaxNode(tree) => {    }' ,
  description: 'write a function that take a tree as an arg and return the max node'
}  

const user = {username: 'qais', password: '1234', role: 'admin'}
let tokenI;
let id;
let userId;
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
      // console.log('TOKEN:::::::::::::::::', data.body.token);
      tokenI=data.body.token
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

  it('Bearer with /dashboard route ', async () => {
    let result = await mockServer.get('/dashboard').set('Cookie', [
        `auth-token=${tokenI}`
      ])
    expect(result.status).toEqual(200)
  });
    
  it('Bearer with /editor route', async () => {
    
    let result = await mockServer.get('/editor').set('Cookie', [
      `auth-token=${tokenI}`
    ])
    expect(result.status).toEqual(200)
  })
  
  it('Bearer with /lobby route', async () => {
    
    let result = await mockServer.get('/lobby').set('Cookie', [
      `auth-token=${tokenI}`
    ])
    expect(result.status).toEqual(200)
  })

  it('Bearer with /leaderboard route ', async () => {
    let result = await mockServer.get('/leaderboard').set('Cookie', [
        `auth-token=${tokenI}`
      ])
    expect(result.status).toEqual(200)
  });

  
  it('Bearer with /getRandom route ', async () => {
    let result = await mockServer.get('/getRandom').set('Cookie', [
        `auth-token=${tokenI}`
      ])
    expect(result.status).toEqual(200)
  });



  it('POST /challenge for admin :', async () => {
    const result = await mockServer.post('/challenge').set('Cookie', [
      `auth-token=${tokenI}`
    ]).send(challenge)
    user.token = tokenI
    id = result.body._id

    expect(result.status).toEqual(201)
  })
  
  it('GET /challenge for admin :', async () => {
 
    const result = await mockServer.get('/challenge').set('Cookie', [
      `auth-token=${tokenI}`
    ])

    expect(result.status).toEqual(200)
  })
  
  it('UPDATE /challenge for admin :', async () => {
    challenge.name = 'getMin'
    const result = await mockServer.put(`/challenge/${id}`).set('Cookie', [
      `auth-token=${tokenI}`
    ]).send(challenge)

    expect(result.status).toEqual(200)
  })
  
  it('DELETE /challenge for admin :', async () => {

    const result = await mockServer.delete(`/challenge/${id}`).set('Cookie', [
      `auth-token=${tokenI}`
    ])
    expect(result.status).toEqual(200)
  })

  it('POST /users for admin :', async () => {
    const result = await mockServer.post('/user').set('Cookie', [
      `auth-token=${tokenI}`
    ]).send(user)
    userId = result.body._id

    expect(result.status).toEqual(201)
  })

  it('GET /user for admin :', async () => {
 
    const result = await mockServer.get('/user').set('Cookie', [
      `auth-token=${tokenI}`
    ])

    expect(result.status).toEqual(200)
  })

  it('PUT /user for admin :', async () => {
    user.username = 'ALI'
    const result = await mockServer.put(`/user/${userId}`).set('Cookie', [
      `auth-token=${tokenI}`
    ]).send(user)

    expect(result.status).toEqual(200)
  })

  it('DELETE /user for admin :', async () => {
 
    const result = await mockServer.delete(`/user/${userId}`).set('Cookie', [
      `auth-token=${tokenI}`
    ])
    expect(result.status).toEqual(200)
  })

  it('OAUTH ROUTE   /oauth', async () => {
    let result = await mockServer.get('/oauth')

    expect(result.status).toEqual(500)
  })

  
});

