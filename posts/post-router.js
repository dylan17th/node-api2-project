const express = require('express')
const Hubs = require('../data/db');
const router = express.Router();


router.get('/', (req,res)=>{
    res.status(200).json({message: 'the router is working correctly'})
})

module.exports = router;