'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const SECRET = 'mysecret' || process.env.SECRET;

const userSchema = {
    username: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
    avatar_url: { type: String},
    bio: { type: String},
    score: { type: Number, default: 0 },
    role: { type: String, default:'user',required:true,enum:['user','admin']}
};
const users = new mongoose.Schema(userSchema);

////BEARER\\\\\
users.statics.authenticateWithToken = async function (token) {
    try {
        let parsedToken = jwt.verify(token, SECRET);
        // it gave me the same token in sign method 
        let user = await this.findOne({ username: parsedToken.username })
        // console.log('user', user);
        if (user) {
             return user; 
        } else {
            return false
        }
    } catch (e) {
      throw new Error(e.message)
    }
}

////ACL\\\\\
users.virtual('capabilities').get(function(){
    let acl={
      user:['read'],
      admin:['read','create','update','delete']
    }
    return acl[this.role];
})
  
const User = mongoose.model('userCode', users )



module.exports = User
