require('dotenv').config()
const express = require('express'),
    server = express(),
    { User, Todo } = require('./models'),
    { encrypt, sign } = require('./utils/crypto')

// middlewares
server.use(express.json())

// environment
const {
    PORT = 3000,
    SERIALIZER,
    RESERIALIZER,
    CRYPTO
} = process.env

// temporary data
let users = []

// routes
server.post('/register', async (req, res) => {
    let { name = null, email = null, password = null } = req.body
    if (!name || !email || !password) return res.status(400).send("All these fields are required: name, email, password.")

    // check if user already exists
    let usersFromDB = await User.find({ email }).exec()
    if (usersFromDB.length > 0) return res.status(409).send("User with specified email already exists.")

    // validate data
    try {
        await User.validate({ email }, ['email'])
    } catch(err) {
        return res.status(200).send(err.errors.email.toString().split('.')[0])
    }
    
    // proceed to store user info
    let encryptedPassword = encrypt(password, CRYPTO)
    await (new User({ name, email, password: encryptedPassword})).save()

    // respond client
    res.send("Okay")
})
server.post('/login', async (req, res) => {
    let { email = null, password = null } = req.body
    if (!email || !password) return res.status(400).send("Both of these fields are required: email, password.")

    let userFromDB = await User.findOne({ email })
    if (!userFromDB) return res.status(404).send("User with specified email not found.")
    let encryptedPassword = encrypt(password, CRYPTO)
    if (encryptedPassword !== userFromDB.password) return res.status(401).send("Password did not match.")
    // update till here
    let signature = sign({ email, password: encryptedPassword }, SERIALIZER)
    res.header("Authorization", `Bearer ${signature}`)
    res.status(200).send("logged in")
})

server.listen(PORT, () => console.log("Server active!!!"))