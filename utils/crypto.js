const crypto = require('crypto'),
    jwt = require('jsonwebtoken')
module.exports = {
    encrypt: (password, secret) => crypto.createHmac('sha256', secret).update(password).digest('hex'),
    sign: (payload, secret) => jwt.sign(payload, secret),
    verify: (payload, secret) => {
        let uData = {}
        jwt.verify(payload, secret, (err, userData) => {
            if (!err) uData = { ...userData }
        })
        return uData
    }
}