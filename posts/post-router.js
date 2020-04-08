const express = require('express')
const db = require('../data/db');
const router = express.Router();


router.get('/', (req,res) => {
db.find()
.then(posts => res.status(200).json(posts))
.catch(err => res.status(500).json({error: "The posts information could not be retrieved."}))
})

router.post('/', (req,res)=> {
    const post = req.body;
    if(post.title && post.contents){
        return db.insert(post)
        .then(postObject => {
            db.findById(postObject.id)
            .then(postNeeded => res.status(201).json(postNeeded)
            )
            .catch(err => res.status(500).json({message: 'couldnt retrieved the updated post'}))
        })
        .catch( err => res.status(500).json({message: `There was an error while saving the post to the database`}))
    }else{
        return res.status(404).json({message:'Please provide title and contents for the post.'})
    }
})

router.get('/:id', (req,res)=>{
    const id = req.params.id;
    db.findById(id)
    .then(post => {
        console.log(post)
        if(post.length !== 0){
            return res.status(200).json(post)
        }else{
            return res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch(err => res.status(500).json({error: "The post information could not be retrieved."}))

})

router.delete('/:id', (req,res)=>{
    const id = req.params.id;
    db.findById(id)
    .then(gotToGoId => {
        db.remove(id)
        .then(postDeleted => {
            if (postDeleted > 0) {
                res.status(200).json(gotToGoId)
            }else{
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        }).catch(err => res.status(500).json({error: "The post could not be removed"}))
    })
    .catch(err => {
        res.status(500).json({message: "error while trying to find the id in database."})
    })
})

router.put('/:id',(req, res)=>{
    const id = req.params.id;
    const body = req.body
    if(body.title && body.contents){
        db.update(id, body)
        .then(numberOfUpdates => {
            if(numberOfUpdates > 0 ){
                db.findById(id)
                .then( object => {
                    res.status(200).json(object)
                }).catch(err => res.status(500).json({message:'the post was updated but the updated post couldnt be returned'}) )
            }else{
                res.status(404).json({error: 'cannot update any post in the database with the given id '})
            }
        })
        .catch(err => res.status(500).json({error: "The post information could not be modified."}))
    }else{
        return res.status(400).json({errorMessage: "Please provide title and contents for the post." })
    }
})

router.get('/:id/comments', (req,res)=> {
    const postId = req.params.id;
    db.findPostComments(postId)
    .then(comment => {
        console.log(comment)
        if(comment.length > 0 ){
            res.status(200).json(comment)
        }else{
            res.status(404).json({message: "there are no comments on that post"})
        }
    })
    .catch(err => res.status(500).json({error: "The post information could not be retrieved."}))
})

router.post('/:id/comments', (req,res)=> {
    const id = req.params.id;
    const comment = req.body;
   db.findById(id)
   .then(post => {
    if(post.length !== 0){
        if (comment.text && comment.post_id){
            return db.insertComment(comment)
            .then(commentId => {
                const newId = commentId.id
                db.findCommentById(newId)
                .then(newComment => res.status(201).json(newComment))
                .catch(err => res.status(500).json({message: 'error happened when sending new commment back to client'}))
            })
            .catch(err => res.status(500).json({error: "There was an error while saving the comment to the database"}))
        }else{
            return res.status(400).json({ errorMessage: "Please provide text for the comment and post_id in body."})
        }
    }else{
        return res.status(404).json({message: "The post with the specified ID does not exist."})
    }
})
   .catch(err => console.log(err))
    
})
module.exports = router;
