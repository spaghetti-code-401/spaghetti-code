require('dotenv').config();
const express = require("express");
const acl=require("../middleware/acl")
const bearer=require("../middleware/bearer")
const router = express.Router();
const userModel = require('../models/user')

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})

router.get('/leaderboard',bearer,acl('read'),async (req,res)=>{
   let leaderboard= await userModel.find().sort({score: -1}).limit(10)
   res.status(200).json(leaderboard);
})

module.exports = router