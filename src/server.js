'use strict';

const express = require('express');
const app = express();


const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(express.static('public'));

app.get('/',(req,res)=>{
 res.render('home')
})
app.get('/editor',(req,res)=>{
 res.render('editor')
})
app.get('/dashboard',(req,res)=>{
  res.render('dashboard')
})

app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  startup: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};