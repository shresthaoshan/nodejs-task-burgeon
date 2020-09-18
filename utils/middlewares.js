require('dotenv').config()
const { verify } = require('../utils/crypto'),
    { User } = require('../models')

const { SERIALIZER } = process.env

module.exports = {
    authenticate: async (req, res, next) => {
        let { headers: { authorization = "" } } = req
        if (!authorization) return res.status(401).send("Authorization token not found.")
        let user = verify(authorization.toString().split(' ')[1], SERIALIZER)
        if (!user) return res.status(401).send("You are not logged in")
        req.user = user
        next()
    }
}