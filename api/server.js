const express = require('express')
const server = express();
const postRouter = require('../posts/post-router.js')

server.use(express.json());
server.use('/api/posts', postRouter)

server.get('/', (req,res) => {
    res.status(200).json({message: 'server is running'})
})

module.exports = server; 