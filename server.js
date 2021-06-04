'use strict'

const express = require('express');
const app = express();

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

app.post('/oauth', Oauth , (req, res) => {
    res.set('auth-token', req.token);
    res.json({
        username: req.user,
        token: req.token
    })
})

app.get('/code',bearer, (req,res)=>{
res.send('hello from code rout')

})

mongoose.connect(MONGO_URI,{
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(3000, () => console.log('Listening To PORT 3000 ...'))
    console.log('Connect to DB');
})




