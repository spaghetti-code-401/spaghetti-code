'use strict';

const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET = 'mysecret' || process.env.SECRET;
const CLIENT_ID = process.env.CLIENT_ID || '88070f9af0cd30ac368b';
const CLIENT_SECRET = process.env.ClIENT_SECRET ||
  '55e61054b00e7b4d8251ed4107816c9ca652cfbb';

const tokenUrl = 'https://github.com/login/oauth/access_token';
const userUrl = 'https://api.github.com/user';

module.exports = async (req, res, next) => {
  try {
    const code = req.query.code;

    const token = await exchangeCodeWithToken(code);

    let remoteUser = await exchangeTokenWithUserInfo(token);

    let [localUser, localToken] = await getLocalUser(remoteUser);
    req.user = localUser;
    req.token = localToken;
    next();
  } catch (e) {
    console.log(e.message);
    next('INVALID LOGIN');
  }
};

async function exchangeCodeWithToken(code) {
  try {
    const tokenRes = await superagent.post(tokenUrl).send({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code
    });
    return tokenRes.body.access_token;
  } catch (e) {
    console.log(e.message);
  }
}

async function exchangeTokenWithUserInfo(token) {
  try {
    const userInfo = await superagent.get(userUrl).set({
      Authorization: `token ${token}`,
      'User-Agent': 'spaghettiCode'
    });
    // console.log('user ===>', userInfo.body);
    return userInfo.body;
  } catch (e) {
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
    };
    let token = jwt.sign({ username: userRecord.username }, SECRET);
    userRecord.token = token;
    const check = jwt.verify(userRecord.token, SECRET);
    const result = await User.findOne({ username: check.username });
    let user;
    if (result) {
      user = result;
    } else {
      let newUser = new User(userRecord);
      user = await newUser.save();
    }
    return [user, token];
  } catch (e) {
    console.log(e.message);
  }
}
