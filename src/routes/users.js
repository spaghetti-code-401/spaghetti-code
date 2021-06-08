require('dotenv').config();
const express = require("express");
const acl=require("../middleware/acl")
const bearer=require("../middleware/bearer")
const router = express.Router();
const userModel = require('../models/user');


router.get('/user' ,bearer,acl('create'),async(req, res) => {
    let getAll = await userModel.find();
    res.status(200).json(getAll);

});

router.post('/user',bearer,acl('create'), async(req, res) => {
    let  newRecord = new userModel(req.body);    
    let  newUser = await newRecord.save();    
    res.status(201).json(newUser);
});

router.get('/user/:id', bearer,acl('create'),async(req, res) => {
    let id = req.params.id
    let getOneEntry = await userModel.findById(id);;
    res.status(200).json(getOneEntry);
});

router.put('/user/:id',bearer,acl('update'), async(req, res) => {
    let id = req.params.id;
    let updateEntry = await userModel.findByIdAndUpdate(id, req.body,{new:true});
    res.status(200).json(updateEntry);
});

router.delete('/user/:id',bearer,acl('delete'), async(req, res) => {
    let id = req.params.id;
    let deleted = await userModel.findByIdAndDelete(id);
    res.status(200).json(deleted);
});

module.exports = router;