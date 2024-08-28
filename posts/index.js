const express = require('express')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())

const posts = {}

app.get('/posts', (req, res) => {
    res.send(posts);
});

const handleEvent = event => {
    console.log(event)
}

app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex')
    const { title } = req.body
    posts[id] = {
        id, title
    }

    await axios.post('http://event-bus-srv:4005/events',{
        type: "PostCreated",
        data: posts[id]
    })
    res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
    handleEvent(req.body)

    res.send({ status: "OK" })
})

app.listen(4000, () => {
    console.log('Listening on 4000')
})