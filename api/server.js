const express = require('express')
const users = require('./users/model.js')
// INSTANCE OF EXPRESS APP
const server = express()

// GLOBAL MIDDLEWARE
server.use(express.json())

// ENDPOINTS
    //GET methods
        //get all the users
server.get('/api/users', (req, res) => {
    console.log('fetching list of users...')
    users.find()
        .then(listOfUsers => {
            res.status(200).json(listOfUsers)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The users information could not be retrieved" })
        })
})
        //returns a user object with specified id
server.get('/api/users/:id', (req, res) => {
    console.log(`fetching user ${req.params.id}...`)
    users.findById(req.params.id)
    .then(user => {
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }

    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "The user information could not be retrieved" })
    })
})

    //POST methods
        //add a new user
server.post('/api/users', async (req, res) => {
    console.log('adding new user...')
    if(!req.body.name || !req.body.bio){
        res.status(400).json({ message: "Provide name and bio" })
    }
    try{
        const user = await users.insert(req.body)
        res.status(201).json(user)
    }catch{
        res.status(500).json({ message: "There was an error while saving the user to the database" })
    }
    // users.insert(req.body)
    //     .then(newUser => res.status(201).json(newUser))
    //     .catch(() => {
    //         res.status(500).json({ message: "There was an error while saving the user to the database" })
    //     })
})

    //PUT methods
        //Updates the user with the specified id
server.put('/api/users/:id', (req, res) => {
    if(!req.body.bio || !req.body.name){
        res.status(400).json({ message: "provide name and bio" })
    }
    console.log(`updating user ${req.params.id}...`)
    users.update(req.params.id, req.body)
        .then(updatedUser => {
            if(updatedUser){
                res.status(200).json(updatedUser)
            }else{
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The user information could not be modified" })
        })
})

    //DELETE methods
        //delete user with specified id 
server.delete('/api/users/:id', (req, res) => {
    console.log(`removing user ${req.params.id}...`)
    users.remove(req.params.id)
    .then(user => {
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "The user could not be removed" })
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
