'use strict'

require('dotenv').config();
const jasonwebtoken = require('jsonwebtoken')

class Jwt {
    static getToken (data) {
        return jasonwebtoken.sign(data, process.env.JWT_SECRET_KEY)
    }

    static verifyToken (token) {
        return jasonwebtoken.verify(token, process.env.JWT_SECRET_KEY)
    }
}

module.exports = {Jwt}