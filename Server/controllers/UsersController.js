'use strict'

const { Jwt } = require('../helpers/Jasonwebtoken')
const { Password } = require('../helpers/Password')
const {Users, Profiles} = require('../models')

class UserController {
    
    static async register (req, res, next) {
        const {username, email, password} = req.body
        try {
            const user = await Users.create({username, email, password, is_active:true})
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

            const checkingEmail = await Users.findOne({where: {email}})
            if(checkingEmail) {
                next({name: "Conflict", message: 'Email already used'})
                return
            }

            const user = await Users.findOne({where:{username}})
    
            if(user.update_token <= 0) {
                next({name: "Bad Request", message: "Insufficient Update Token!"})
                return
            }
    
            await Users.update({email, update_token:user.update_token-1}, {
                where: {
                    username
                },
            })
            
            res.status(201).json({message: 'Email Updated Successfully'})
        } catch (err) {
            next(err)
        }
    }

    static async changePassword (req, res, next) {
        try {
            const {username} = req.params
            const {oldPassword, newPassword, newPassword2} = req.body
            //Make sure all the password defined
            if (!oldPassword || !newPassword || !newPassword2) {
                next({name: 'Bad Request', message:'Please insert your password'})
                return
            }
            //checking typo new password
            if (newPassword !== newPassword2) {
                next({name: 'Bad Request', message: 'Password should be identic'})
                return
            }

            const user = await Users.findOne({
                where: {username}
            })

            //Checking user's data in database
            if(!user) {
                next({name: "Not Found", message: 'User Not Found'})
                return
            }

            //Checking password to make sure real user that make a change
            const checkingPassword = Password.comparePassword(oldPassword, user.password)
            if(!checkingPassword) {
                next({name: 'Bad Request', message: 'Incorrect Password'})
                return
            }

            //Checking new password should not identic with old password
            const comparePassword = oldPassword === newPassword
            if(comparePassword) {
                next({name: 'Bad Request', message:'You make no difference'})
                return
            }

            // checking availability of token
            if(user.update_token <= 0) {
                next({name: "Bad Request", message: "Insufficient Update Token!"})
                return
            }

            //Updating process
            await Users.update({password: newPassword, update_token:user.update_token-1}, {
                where: {username},
                individualHooks: true
            })
            res.status(201).json({message: 'Password Updated Successfully!'})
       
        } catch (err) {
            next(err)
        }
    }
    //Chaange is verified
    //Update token every day

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