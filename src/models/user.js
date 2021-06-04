'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const SECRET = 'mysecret' || process.env.SECRET;

const userSchema = {
    username: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
    avatar_url: { type: String},
    bio: { type: String}
};
const users = new mongoose.Schema(userSchema);


users.statics.authenticateWithToken = async function (token) {
    try {
        let parsedToken = jwt.verify(token, SECRET);
        // it gave me the same token in sign method 
        let user = await this.findOne({ username: parsedToken.username })
        // console.log('user', user);
        if (user) {
             return true; 
        } else {
            return false
        }
    } catch (e) {
      throw new Error(e.message)
    }
}
  
const User = mongoose.model('userCode', users )



module.exports = User