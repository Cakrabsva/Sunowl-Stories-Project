'use strict'

class UserController {
    static async register (req, res, next) {
        try {
            res.send('masuk broo')
            console.log('Berhasil masuk register')
        } catch (err) {
            console.log(err)
        }
    }
 }

 module.exports = UserController