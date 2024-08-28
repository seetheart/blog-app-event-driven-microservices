const express = require('express')
const axios = require('axios')

const app = express()
app.use(express.json())

const handleEvent = async (event) =>{
    const {type, data} = event

    if(type == 'CommentCreated'){
        const status = data.content.includes('orange') ? 'rejected' : 'approved'

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        })
    }
}

app.post('/events', (req, res) => {
    console.log(req.body)
    handleEvent(req.body)
    res.send({status: 'OK'})
})

app.listen(4003, () => {
    console.log("Listening on 4003")
})