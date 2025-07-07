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

    static async login (req, res, next) {
        try {
            res.send('masuk login')
        } catch (err) {
            console.log(err)
        }
    }

    static async getUser (req, res, next) {
        try {
            res.send('Masuk di User')
        } catch (err) {
            console.log(err)
        }
    }

    static async changeEmail (req, res, next) {
        try {
            res.send('Masuk di Change email')
        } catch (err) {
            console.log(err)
        }
    }

    static async changePassword (req, res, next) {
        try {
            res.send('Masuk di Change Password')
        } catch (err) {
            console.log(err)
        }
    }

/* ONLY ADMIN */

    static async getAllUsers (req, res, next) {
        try {
            res.send('masuk di get all users')
        } catch (err) {
            console.log(err)
        }
    }

    static async deActivedUser (req, res, next) {
        try {
            res.send('masuk di deactive users')
        } catch (err) {
            console.log(err)
        }
    }

    static async deleteUser (req, res, next) {
        try {
            res.send('Masuk di delete user')
        } catch (err) {
            console.log(err)
        }
    }

 }

 module.exports = UserController