'use strict'

const bcrypt = require('bcryptjs')

function hashPassword (password) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

function comparePassword (password, hashPass) {
    return bcrypt.compareSync(password, hashPass)
}

module.exports = {
    hashPassword,
    comparePassword
}