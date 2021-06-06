'use strict';

const jwt = require('jsonwebtoken');
const user =require('../models/user.js')

const SECRET = 'mysecret' || process.env.SECRET;


module.exports= async (req,res,next)=>{
    try {
        // req.headers.cookie = ""
        // if(!req.headers.cookie) {next('NO TOKEN')}
        console.log(req.headers.cookie.io)
        const preToken =  req.headers.cookie.split(';')[0]
        console.log(preToken)
        const token = preToken.split('=')[1]
        // const token = preToken[1].split('=')[1]
        const validUser = await user.authenticateWithToken(token);
        req.user = validUser;

        if(validUser){
            next()
        }else{
            // next('INVALID')
            res.redirect('/')
        }

    } catch(e) {
        // next('INVALID LOGIN')
        res.redirect('/')
    }
}
