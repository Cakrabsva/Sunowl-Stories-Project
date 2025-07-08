'use strict'

const { Jwt } = require('../helpers/Jasonwebtoken')
const { Password } = require('../helpers/Password')
const {Users, Profiles} = require('../models')

class UserController {
    
    static async register (req, res, next) {
        const {username, email, password} = req.body
        try {
            const user = await Users.create({username, email, password})
            if (user) await Profiles.create({UserId:user.id})
            res.status(201).json({message: 'Sucessfully Register'})
        } catch (err) {
            console.log(err.name)
            err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError' ? next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async login (req, res, next) {
        try {
            const {username, password} = req.body

            if(!username || !password) {
                next({name: 'Bad Request', message: 'Please insert username or password!'})
                return
            }


            const user = await Users.findOne({
                where: {username}
            })

            if (!user) {
                next({name: 'Not Found', message: 'User not found, please register'})
                return
            }

            const checkingPassword = Password.comparePassword(password, user.password)

            if(!checkingPassword) {
                next({name: 'Bad Request', message: 'Incorrect Password!'})
                return
            }

            const accessToken = Jwt.getToken({id: user.id})
            res.status(201).json({message:'Login Success', token: accessToken, username: user.username})

        } catch (err) {
            next(err)
        }
    }

    static async getUser (req, res, next) {
        try {
            const {username} = req.params
            const user = await Users.findOne({where:{username}, include:[{model:Profiles}]})
            if(!user) {
                next({name: 'Not Found', message:"User not Found"})
                return
            }
            res.status(201).json(user)
        } catch (err) {
            next(err)
        }
    }

    static async changeEmail (req, res, next) {
        try {
            const {username} = req.params
            const {email} = req.body

            if(!email) {
                next({name: "Bad Request", message: 'Insert your new email!'})
                return
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)) {
                next({name: "Bad Request", message:'Invalid email format!'})
            }

            const user = await Users.findOne({where: {email}})
            if(user) {
                next({name: "Conflict", message: 'Email already used'})
                return
            }

            await Users.update(email, {
                where: {
                    username
                }
            })
            res.status(201).json({message: 'Email Updated Successfully'})
        } catch (err) {
            next(err)
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
// change admin role

 }

 module.exports = UserController