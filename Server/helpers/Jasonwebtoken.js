'use strict'

require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken')

class Jwt {
    static getToken (data) {
        return jsonwebtoken.sign(data, process.env.JWT_SECRET_KEY)
    }

    static verifyToken (token) {
        return jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY)
    }
}

module.exports = {Jwt}