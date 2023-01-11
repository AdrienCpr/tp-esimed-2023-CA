const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const myLogger = function (req, res, next) {
    const reqTime = Date.now()

    res.on('finish', () => {
        console.log(`[${new Date()}] ${req.ip} ${Date.now() - reqTime}ms ${req.method} ${req.originalUrl}`)
    })
    next()
  }
app.use(myLogger);

let users = []
let increment = 1

app.get('/users/add', (req, res) => {
    res.status(200).send(users)
})

app.post('/users/add', (req, res) => {
    const user = req.body
    user.id = increment

    users.push(user)
    increment++

    res.sendStatus(201)
  })

  app.get('/users', (req, res) => {
    res.send(users)
  })

  app.get('/users/:firstName', (req, res) => {
    if(req.params.firstName)
    {
        const firstName = req.params.firstName
        const user = users.find(user => user.firstName === firstName)
        
        res.status(200).send(user)
    } else {
        res.sendStatus(400)
    }
  })

  app.put('/users/update/:id', (req, res) => {
    if(req.params.id)
    {
        const id = parseInt(req.params.id);
        const userUpdated = { ...req.body, id }
        
        let foundIndex = users.findIndex(user => user.id == id);
        users[foundIndex] = userUpdated;

        res.status(200).send(userUpdated)
    } else {
        res.sendStatus(400)
    }
})

app.delete('/users/delete/:id', (req, res) => {
    if(req.params.id)
    {
        const id = parseInt(req.params.id)
        users = users.filter(user => user.id !== id)
       
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})