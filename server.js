'use strict'

const express = require('express');
const app = express();

const notFoundError = require('./src/handlers/404') 
const errorsHandler = require('./src/handlers/500') 

const mongoose = require('mongoose'); 

const MONGO_URI = 'mongodb://localhost:27017/spagitti'

const Oauth = require('./src/middleware/oauth')
const bearer= require('./src/middleware/bearer')

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use(express.static('public'))

// app.get('/', (req, res) => {
//     res.send('Hello From Server')
// })

app.get('/oauth', Oauth , (req, res) => {
    res.set('auth-token', req.token);
    res.cookie('auth-token', req.token)
    res.json({
        username: req.user,
        token: req.token
    })
})

app.get('/code', bearer, (req,res)=>{
  res.send('hello from code rout')

})

app.use('*', notFoundError)
app.use(errorsHandler)

mongoose.connect(MONGO_URI,{
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(3000, () => console.log('Listening To PORT 3000 ...'))
    console.log('Connect to DB');
})




