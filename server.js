require('dotenv').config()
const express = require('express'),
    server = express(),
    { User, Todo } = require('./models'),
    { encrypt, sign } = require('./utils/crypto'),
    { authenticate } = require('./utils/middlewares')

// middlewares
server.use(express.json())

// environment
const {
    PORT = 3000,
    SERIALIZER,
    RESERIALIZER,
    CRYPTO
} = process.env

// routes
// users
server.post('/register', async (req, res) => {
    let { name = null, email = null, password = null } = req.body
    if (!name || !email || !password) return res.status(400).send("All these fields are required: name, email, password.")

    // check if user already exists

    let usersFromDB = []
    try {
        usersFromDB = await User.find({ email }).exec()
    } catch (e) {
        console.log(e)
        return res.status(500).send("There was a problem executing your request. Please, try again later.")
    }
    if (usersFromDB.length > 0) return res.status(409).send("User with specified email already exists.")

    // validate data
    try {
        await User.validate({ email }, ['email'])
    } catch(err) {
        return res.status(200).send(err.errors.email.toString().split('.')[0])
    }
    
    // proceed to store user info
    let encryptedPassword = encrypt(password, CRYPTO)
    try {
        await (new User({ name, email, password: encryptedPassword})).save()
    } catch (e) {
        console.log(e)
        return res.status(500).send("There was a problem executing your request. Please, try again later.")
    }

    // respond client
    res.send("Okay")
})
server.post('/login', async ({ body: { email = null, password = null } }, res) => {
    if (!email || !password) return res.status(400).send("Both of these fields are required: email, password.")

    // attempt accessing user record from database
    let userFromDB = null
    try {
        userFromDB = await User.findOne({ email })
    } catch (e) {
        console.log(e)
        return res.status(500).send("There was a problem executing your request. Please, try again later.")
    }
    if (!userFromDB) return res.status(404).send("User with specified email not found.")

    // attempt matching passwords
    let encryptedPassword = encrypt(password, CRYPTO)
    if (encryptedPassword !== userFromDB.password) return res.status(401).send("Password did not match.")
    
    // sign a token, set header and respond client
    let signature = sign({ id: userFromDB._id, email }, SERIALIZER)
    res.status(200).send({ token: signature })
})

// todos
server.post('/todo', authenticate, async ({ user: { id }, body: { todo = "" } }, res) => {
    if (!todo) return res.status(400).send("Todo is required.")

    // store todo as a new record
    try {
        await (new Todo({ user: id, todo })).save()
    } catch (e) {
        console.log(e)
        return res.status(500).send("There was a problem executing your request. Please, try again later.")
    }

    // respond client
    res.status(200).json({ todo })
})
server.get('/todo', authenticate, async ({ user: { id } }, res) => {
    // access all todo records in reference to the user
    let todos = []
    try {
        todos = await Todo.find({ user: id })
    } catch (e) {
        console.log(e)
        return res.status(500).send("There was a problem executing your request. Please, try again later.")
    }

    // respond client w/ todos
    res.json({ todos })
})
server.delete('/todo/:todo_id', authenticate, async ({ params: { todo_id } }, res) => {
    // single-out and delete the todo record
    let deletedTodo = null
    try {
        deletedTodo = await Todo.findByIdAndDelete(todo_id)
    } catch (e) {
        console.log(e)
        return res.status(500).send("There was a problem executing your request. Please, try again later.")
    }

    // respond client
    if (!deletedTodo) return res.status(404).send("Todo record with specified id not found.")
    res.status(200).send("deleted")
})

// initiate server
server.listen(PORT, () => console.log("Server active!!!"))