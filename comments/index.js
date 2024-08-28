const express = require('express')
const cors = require('cors')
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())
const commentsByPostId = {
}

const handleEvent = async (event) => {
    const { type, data } = event

    if(type == 'CommentModerated'){
        const { postId, id, status, content } = data
        
        const comments = commentsByPostId[postId]

        const comment = comments.find( comment => comment.id == id)
        comment.status = status

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                content,
                status
            }
        })
    }
}

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id]  || [])
})

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex')
    const { content } = req.body
    const comments = commentsByPostId[req.params.id] || []

    comments.push({ id: commentId, content, status: 'pending'})
    await axios.post('http://event-bus-srv:4005/events',{
        type: "CommentCreated",
        data: {
            id: commentId,
            content,
            status: 'pending',
            postId: req.params.id
        }
    })

    commentsByPostId[req.params.id] = comments
    res.status(201).send(comments)
})

app.post('/events', (req, res) => {
    console.log(req.body)
    handleEvent(req.body)
    res.send({status: "OK"})
})

app.listen(4001, () => {
    console.log('Listening on post 40001')
})