'use strict';

const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const SECRET = 'mysecret' || process.env.SECRET ;
const CLIENT_ID = 'a41277711942cc3f0f87' || process.env.CLIENT_ID;
const CLIENT_SECRET = '6f34f4f2e62f83510bcbda767d07d099dff52e66' || process.env.ClIENT_SECRET;

const tokenUrl = 'https://github.com/login/oauth/access_token';
const userUrl = 'https://api.github.com/user';

module.exports = async (req, res, next) => {
    try{
        const code = req.query.code
        
        const token = await exchangeCodeWithToken(code)

        let remoteUser = await exchangeTokenWithUserInfo(token)

        let [localUser, localToken] = await getLocalUser(remoteUser)
        req.user = localUser;
        req.token = localToken;
        next()
        
    } catch(e) {
        console.log(e.message);
        next('INVALID LOGIN')
    }


}


async function exchangeCodeWithToken(code) {
    try {
        const tokenRes = await superagent.post(tokenUrl).send({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code
        })
        return tokenRes.body.access_token
    } catch(e) {
        console.log(e.message);
    }
} 


async function exchangeTokenWithUserInfo(token) {
    try {
        const userInfo = await superagent.get(userUrl).set({
            'Authorization': `token ${token}`,
            'User-Agent': 'qaisw96/1.0'
        })
        // console.log('user ===>', userInfo.body);
        return userInfo.body
    }catch(e) {
        console.log(e.message);
    }
}


async function getLocalUser(userObj) {
    
    try {
        let userRecord = {
            username: userObj.login,
            password: 'oauth',
            avatar_url: userObj.avatar_url,
            bio: userObj.bio
        }
        
        let token = jwt.sign({username: userRecord.username}, SECRET)
        userRecord.token=token
        // const check = jwt.verify(userRecord.token, SECRET)
        let newUser = new User(userRecord)
        let user = await newUser.save()

        return [user, token]
    } catch(e) {
        console.log(e.message);
    }
}