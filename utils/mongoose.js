require('dotenv').config()
const mongoose = require('mongoose')
const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env
mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@c1.hjrxz.gcp.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})

module.exports = mongoose