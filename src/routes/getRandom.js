require('dotenv').config();
const express = require("express");
const acl=require("../middleware/acl")
const bearer=require("../middleware/bearer")
const router = express.Router();
const challengeModel = require('../models/challenge');

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})

router.get('/getRandom',async (req,res)=>{
 let random;
 challengeModel.countDocuments().exec(function (err, count) {

    var randomNum = Math.floor(Math.random() * count)
  
    challengeModel.findOne().skip(randomNum).exec(
      function (err, result) {
        random=result
        console.log(random)
        res.status(200).json(random)
      })
  })
})

module.exports = router