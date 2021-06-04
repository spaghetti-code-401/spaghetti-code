'use strict';

const jwt = require('jsonwebtoken');
const user =require('../models/user.js')

const SECRET = 'mysecret' || process.env.SECRET ;


module.exports=(req,res,next)=>{
   
    console.log(req.headers.authorization);
    const token=req.headers.authorization
    const check=jwt.verify(token,SECRET)
     
    if(check){
        next()
    }else{
        res.redirect('/outh')
    }

}