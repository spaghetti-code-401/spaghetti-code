'use strict';

const jwt = require('jsonwebtoken');
const user =require('../models/user.js')

const SECRET = 'mysecret' || process.env.SECRET;


module.exports= async (req,res,next)=>{
    try {
        // req.headers.cookie = ""
        // if(!req.headers.cookie) {next('NO TOKEN')}
        const token = req.headers.cookie.split('=')[1]
        // const token = preToken[1].split('=')[1]
      
        const validUser = await user.authenticateWithToken(token);

        if(validUser){
            next()
        }else{
            next('INVALID')
        }

    } catch(e) {
        next('INVALID LOGIN')
    }
}
