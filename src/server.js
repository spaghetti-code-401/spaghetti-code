'use strict';

const express = require('express');
const app = express();


const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

const oauth = require('../src/middleware/oauth')
const bearer = require('../src/middleware/bearer')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(express.static('public'));

app.get('/',(req,res)=>{
 res.render('home')
})

app.get('/oauth', oauth, (req, res) => {
  res.cookie('auth-token', req.token)
  res.redirect('/dashboard')
})

app.get('/guess', bearer,(req,res)=>{
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }
  res.render('guess', {formattedUser});
})
app.get('/lobby', bearer,(req,res)=>{
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }
  res.render('lobby', {formattedUser});
})
app.get('/editor', bearer,(req,res)=>{
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }
  res.render('editor', {formattedUser});
})

app.get('/dashboard', bearer, (req,res)=>{
  let user = req.user;
  let formattedUser = {
    username: user.username,
    score: user.score,
    avatar_url: user.avatar_url
  }
  res.render('dashboard', {formattedUser});
})

app.use('*', bearer, notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  startup: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};