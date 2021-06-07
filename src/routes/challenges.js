require('dotenv').config();
const express = require("express");

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

router.get('/challenge', async(req, res) => {
    let getAll = await challengeModel.find();
    res.status(200).json(getAll);

});

router.post('/challenge', async(req, res) => {

    let newRecord = new challengeModel(req.body);
    
    let newChallenge = newRecord.save();

    
    res.status(201).json(newChallenge);
});

router.get('/challenge/:id', async(req, res) => {
    let id = req.params.id
    let getOneEntry = await challengeModel.findById(id);;
    res.status(200).json(getOneEntry);
});

router.put('/challenge/:id', async(req, res) => {
    let id = req.params.id;
    let updateEntry = await challengeModel.findByIdAndUpdate(id, req.body,{new:true});
    res.status(200).json(updateEntry);
});

router.delete('/challenge/:id', async(req, res) => {
    let id = req.params.id;
    let deleted = await challengeModel.findByIdAndDelete(id);
    res.status(200).json(deleted);
});

module.exports = router;