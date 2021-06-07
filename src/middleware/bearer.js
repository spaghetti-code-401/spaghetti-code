'use strict';

const jwt = require('jsonwebtoken');
const user =require('../models/user.js')

const SECRET = 'mysecret' || process.env.SECRET;


module.exports= async (req,res,next)=>{
    console.log('///////////////////////',req.headers.cookie)
    let token;
    try {
        if( /\=/.test( req.headers.cookie)) {
            token = req.headers.cookie.split('=')[1]
            console.log('first if',token)
            
        } else if(/\;/.test(req.headers.cookie)) {
            console.log('second if',token)
            const preToken = req.headers.cookie.split(';')[1]
            token = preToken.split('=')[1]
            
        } else {
            console.log('third if',token)
            token = req.headers.cookie            
        }
        // req.headers.cookie = ""
        // if(!req.headers.cookie) {next('NO TOKEN')}
        // console.log(req.headers.cookie.io)
        // const preToken =  req.headers.cookie
        // console.log(preToken)
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
        next('INVALID LOGIN')
        // console.log('bearer//////////////////////////////')
        // next(e)
    }
}
