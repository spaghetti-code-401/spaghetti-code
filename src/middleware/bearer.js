'use strict';

const jwt = require('jsonwebtoken');
const user =require('../models/user.js')

const SECRET = 'mysecret' || process.env.SECRET;


module.exports= async (req,res,next) => {

    try {
        const token =  req.cookies['auth-token']
        const validUser = await user.authenticateWithToken(token);
        req.user = validUser;

        if(validUser){
            next()
        }else{
            res.redirect('/')
        }

    } catch(e) {
        next('INVALID LOGIN')
    }
}
