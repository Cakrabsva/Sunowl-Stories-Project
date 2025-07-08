'use strict'

const bcrypt = require('bcryptjs')

class Password {

    static hashPassword (password) {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        return hash
    }
    static comparePassword (password, hashPass) {
        return bcrypt.compareSync(password, hashPass)
    }

}

module.exports = {
    Password
}