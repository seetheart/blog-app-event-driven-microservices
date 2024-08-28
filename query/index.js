const express = require('express')
const cors= require('cors')
const axios = require('axios')
const app = express()

app.use(cors())
app.use(express.json())

posts = {}

const handleEvent = (type, data) => {
    console.log(data)
    if(type == 'PostCreated'){
        const { id, title } = data
        posts[id] = { id, title, comments: []}
    }
    else if(type == 'CommentCreated'){
        const {id, content, postId, status} = data 
        posts[postId].comments.push({id, content, status})
    }
    else if(type == 'CommentUpdated'){
        const {id, content, postId, status} = data 
        comment = posts[postId].comments.find((comment) => {
            return comment.id == id
        })
        comment.status = status
        comment.content = content
    }
    
}

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    console.log(req.body)
    const {type, data} = req.body
    handleEvent(type, data)
    res.send({ status: "OK" })
})

app.listen(4002, async () => {
    console.log("Listening on Port 4002")
    try {
        const res = await axios.get("http://event-bus-srv:4005/events");
     
        for (let event of res.data) {
          console.log("Processing event:", event.type);
     
          handleEvent(event.type, event.data);
        }
      } catch (error) {
        console.log(error.message);
      }
})
