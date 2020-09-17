const crypto = require('crypto'),
    jwt = require('jsonwebtoken')
module.exports = {
    encrypt: (password, secret) => crypto.createHmac('sha256', secret).update(password).digest('hex'),
    sign: (payload, secret) => jwt.sign(payload, secret)
}