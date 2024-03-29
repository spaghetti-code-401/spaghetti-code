require('dotenv').config();
const express = require("express");
const acl=require("../middleware/acl")
const bearer=require("../middleware/bearer")
const router = express.Router();
const challengeModel = require('../models/challenge');

const mongoose = require('mongoose');


router.get('/challenge' ,bearer,async(req, res) => {
    let getAll = await challengeModel.find();
    res.status(200).json(getAll);

});

router.post('/challenge',bearer,acl('create'), async(req, res) => {

    let  newRecord = new challengeModel(req.body);
    
    let  newChallenge = await newRecord.save();

    
    res.status(201).json(newChallenge);
});

router.get('/challenge/:id', bearer,async(req, res) => {
    let id = req.params.id
    let getOneEntry = await challengeModel.findById(id);;
    res.status(200).json(getOneEntry);
});

router.put('/challenge/:id',bearer,acl('update'), async(req, res) => {
    let id = req.params.id;
    let updateEntry = await challengeModel.findByIdAndUpdate(id, req.body,{new:true});
    res.status(200).json(updateEntry);
});

router.delete('/challenge/:id',bearer,acl('delete'), async(req, res) => {
    let id = req.params.id;
    let deleted = await challengeModel.findByIdAndDelete(id);
    res.status(200).json(deleted);
});

module.exports = router;