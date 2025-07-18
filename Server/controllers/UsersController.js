'use strict'

const { Jwt } = require('../helpers/Jasonwebtoken')
const { MyDate } = require('../helpers/MyDate')
const { Password } = require('../helpers/Password')
const validator = require('validator');
const {Users, Profiles} = require('../models');
const { Checking } = require('../helpers/MyValidator');
const { MyFunction } = require('../helpers/MyFunction');

class UserController {
    
    static async register (req, res, next) {
        const {username, email, password} = req.body
        try {
            const user = await Users.create({username, email, password, is_active:true})
            if (user) await Profiles.create({UserId:user.id, first_name:MyFunction.firstNameGenetrator(user.id)})
            res.status(201).json({message: 'Sucessfully Register'})
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async login (req, res, next) {
        try {
            const { emailUsername, password} = req.body
           //Checking if emailUsername defined
           if(!emailUsername) {
               next({name: 'Bad Request', message: 'Please insert your email/username!'})
               return
            }

            //Checking if password defined
            if(!password) {
                next({name: 'Bad Request', message: 'Please insert your password!'})
                return
            }

            //Checking emailUsername is email or username
            const emailValidity = MyFunction.isValidEmail(emailUsername)
            let user
            if(emailValidity) {
                user = await Users.findOne({
                    where: {email:emailUsername}, 
                    include:[{model:Profiles}]
                })
            } else {
                user = await Users.findOne({
                    where: {username:emailUsername}, 
                    include:[{model:Profiles}]
                })
            }

            //Checking registered user
            if (!user) {
                next({name: 'Not Found', message: 'User not found, please register'})
                return
            }
            //Checking Password
            const checkingPassword = Password.comparePassword(password, user.password)
            if(!checkingPassword) {
                next({name: 'Bad Request', message: 'Incorrect Password!'})
                return
            }
            //login return data
            const accessToken = Jwt.getToken({id: user.id})
            res.status(201).json({message:'Login Success', token: accessToken, id: user.id, first_name: user.Profile.first_name})

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async getUser (req, res, next) {
        try {
            const {id} = req.params
            //validating id
            if (!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }
            // const user = await Users.findOne({where:{id}, include:[{model:Profiles}]})
            const user = await Checking.userValidity(id)
            if(!user) {
                next({name: 'Not Found', message:"User not Found"})
                return
            }
            res.status(200).json(user)
        } catch (err) {
            console.log(err)
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async changeEmail (req, res, next) {
        try {
            const {id} = req.params
            const {email} = req.body
            //Check if email defined
            if(!email) {
                next({name: "Bad Request", message: 'Insert your new email!'})
                return
            }
            //Checking UUID Validity
             if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }
            //checking email format
            const emailValidity = MyFunction.isValidEmail(email)
            if(!emailValidity) {
                next({name: "Bad Request", message:'Invalid email format!'})
            }
            //Checking unique email
            const checkingEmail = await Users.findOne({where: {email}})
            if(checkingEmail) {
                next({name: "Conflict", message: 'Email already used'})
                return
            }
            //Checking registered user
            const user = await Checking.userValidity(id)
            if(!user) {
                next({name: 'Not Found', message: 'User Not Found'})
                return
            }
            //Checking Token
            if(user.update_token <= 0) {
                next({name: "Bad Request", message: "Insufficient Update Token!"})
                return
            }
            //processing update email
            await Users.update({email, update_token:user.update_token-1}, {
                where: {
                    id
                },
            })
            res.status(201).json({message: 'Email Updated Successfully'})
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async changePassword (req, res, next) {
        try {
            const {id} = req.params
            const {oldPassword, newPassword, newPassword2} = req.body
            //Make sure all the password defined
            if (!oldPassword || !newPassword || !newPassword2) {
                next({name: 'Bad Request', message:'Please insert your password'})
                return
            }
            //Checking UUID Validity
            if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }

            //Checking typo new password
            if (newPassword !== newPassword2) {
                next({name: 'Bad Request', message: 'Password should be identic'})
                return
            }
            //Checking registered user
            const user = await Checking.userValidity(id)
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
            //checking verified user
            const verifiedUser = user.is_verified
            if(!verifiedUser) {
                next({name: 'Bad Request', message: 'Verify your email first'})
                return
            }
            //Updating process
            await Users.update({password: newPassword, update_token:user.update_token-1}, {
                where: {id},
                individualHooks: true
            })
            res.status(201).json({message: 'Password Updated Successfully!'})
       
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async changeUsername (req, res, next) {
        try {
            const {id} = req.params
            const {newUsername, password} = req.body
            //Checking if req.body is empty or ondefined
            if (!newUsername) {
                next({name: 'Bad Request', message:'New username cannot empty'})
                return
            }
            //Checking if password is empty or undefined
            if (!password) {
                next({name: 'Bad Request', message:'Password cannot empty'})
                return
            }
            //Checking UUID Validity
             if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }
            //checking availability user
            const user = await Checking.userValidity(id)
            if(!user) {
                next({name: 'Not Found', message: 'User Not Found'})
                return
            }
            //checking username same as before
            let oldUsername = user.username
            if(oldUsername === newUsername) {
                next({name: "Conflict", message: 'Username same as before'})
                return
            }
            //checking verified user
            const verifiedUser = user.is_verified
            if(!verifiedUser) {
                next({name: 'Bad Request', message: 'Verify your email first'})
                return
            }
            //checking token
            const tokenValidity = user.update_token
            if(tokenValidity <= 0) {
                next({name:'Bad Request', message:'Insufficient Update Token!'})
                return
            }
            //checking lastUpdated username
            if(user.username_updatedAt) {
                const today = MyDate.formateDate(new Date())
                const usernameUpdatedAt = MyDate.formateDate(user.username_updatedAt)
                const usernameUpdatedAtValidity = MyDate.transformDate(today) - MyDate.transformDate(usernameUpdatedAt)
                if(usernameUpdatedAtValidity <= 30) {
                    next({name: 'Bad Request', message: `You can change username in ${30 - usernameUpdatedAtValidity} days more`})
                    return
                } 
            }
            //checking password
            const checkingPassword = Password.comparePassword(password, user.password)
            if(!checkingPassword) {
                next({name: 'Bad Request', message: 'Incorrect Password!'})
                return
            }
            //applying update > decreasing update token -1
            await Users.update({
                username:newUsername, 
                username_updatedAt:new Date(), 
                update_token: user.update_token-1
            }, {
                where: {id}
            })

            res.status(201).json({message: 'Username Successfully Updated!'})

        } catch(err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async verifyUser (req, res, next) {
        try {
            const {id} = req.params

            //Checking UUID Validity
             if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }

            //Checking users in database
            const user = await Users.findOne({where:{id}})
            if(!user) {
                next({name: 'Not Found', message: 'User Not Found'})
                return
            }

            //Update process
            await Users.update({is_verified:true}, {
                where: {id}
            })
            res.status(201).json({message: 'Verifying User Successfully'})

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
    
    static async updateToken (req, res, next) {
        try {
            const {id} = req.params
             //Checking UUID Validity
            if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }

            //Checking users in database
            const user = await Users.findOne({where:{id}})
            if(!user) {
                next({name: 'Not Found', message: 'User Not Found'})
                return
            }

            //Update process
            await Users.update({update_token:5}, {
                where: {id}
            })
            res.status(201).json({message: 'Token Updated'})
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async resetPassword (req, res, next) {
        try {
            const {email} = req.body
            //Checking email should be defined
            if(!email) {
                next({name: 'Bad Request', message: 'input your email' })
                return 
            }

            //Checking email format validity
            const emailValidity = MyFunction.isValidEmail(email)
            if(!emailValidity) {
                next({name: 'Bad Request', message: 'Invalid email format' })
                return
            }

            const user = await Users.findOne({
                where: {email}
            })
            //Checking user in database
            if(!user) {
                next({name: 'Not Found', message: 'Email not registered' })
                return
            }

            res.status(200).json({message:'Email Sent', id: user.id})

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async forgotPassword (req, res, next) {
         try {
            const {id} = req.params
            const { newPassword, confirmPassword } = req.body
            //Make sure all the password defined
            if (!newPassword || !confirmPassword) {
                next({name: 'Bad Request', message:'Please insert your password'})
                return
            }
            //Checking UUID Validity
            if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }

            //Checking typo new password
            if (newPassword !== confirmPassword) {
                next({name: 'Bad Request', message: 'Password should be identic'})
                return
            }
            //Checking registered user
            const user = await Checking.userValidity(id)
            if(!user) {
                next({name: "Not Found", message: 'User Not Found'})
                return
            }
            
            //Updating process
            await Users.update({password: newPassword}, {
                where: {id},
                individualHooks: true
            })
            res.status(201).json({message: 'Password Updated Successfully!'})
       
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

/* ONLY ADMIN */

    static async getAllUsers (req, res, next) {
        try {
            const {id} = req.params
            //Checking UUID Validity
            if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }
            //Checking users in database
            const user = await Checking.userValidity(id)
            if(!user) {
                next({name: 'Not Found', message: 'User Not Found'})
                return
            }
            //Checking authority
            if(!user.is_admin) {
                next({name: 'Unauthorized', message: 'Unauthorized, Only Admin'})
                return
            }
            //Getting data process
            const allUsers = await Users.findAll()
            res.status(201).json({message: 'You get all the users', allUsers})
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async changeRole (req, res, next) {
        try {
            const {id, username} = req.params
            const {is_admin} = req.body
            console.log(username)
            //Checking UUID Validity
            if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }
            //Checking is_admin should defined
            if(!is_admin) {
                next({name: 'Bad Request', message: 'admin role cannot empty' })
                return 
            }
            //Conditioning username empty or undefined
            if(username === ":username") {
                next({name: 'Bad Request', message: 'Username cannot empty' })
                return 
            }
            //Checking username registered in database
            const usernameValidator = await Checking.userValidityByUsername(username)
            if(!usernameValidator) {
                next({name: 'Bad Request', message: 'Username not found'})
                return
            }
            //Checking users in database
            const user = await Checking.userValidity(id)
            if(!user) {
                next({name: 'Not Found', message: 'User Not Found'})
                return
            }
            //Checking authority
            if(!user.is_admin) {
                next({name: 'Unauthorized', message: 'Unauthorized, Only Admin'})
                return
            }
            //Updating role admin
            await Users.update({is_admin}, {
                where: {username}
            })
            res.status(201).json({message: 'User role updated'})

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async changeStatusUser (req, res, next) {
        try {
            const {id, username} = req.params
            const {is_active} = req.body
            //Checking UUID Validity
            if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }
            //Checking is_active should defined
            if(!is_active) {
                next({name: 'Bad Request', message: 'user status cannot empty' })
                return 
            }
            //Conditioning username empty or undefined
            if(username === ":username") {
                next({name: 'Bad Request', message: 'Username cannot empty' })
                return 
            }
            //Checking username registered in database
            const usernameValidator = await Checking.userValidityByUsername(username)
            if(!usernameValidator) {
                next({name: 'Bad Request', message: 'Username not found'})
                return
            }
            //Checking users in database
            const user = await Users.findOne({where:{id}})
            if(!user) {
                next({name: 'Not Found', message: 'User Not Found'})
                return
            }
            //Checking authority
            if(!user.is_admin) {
                next({name: 'Unauthorized', message: 'Unauthorized, Only Admin'})
                return
            }
            //Updating Process
            await Users.update({is_active}, {
                where: {username}
            })
            res.status(201).json({message: 'User status changed'})
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async deleteUser (req, res, next) {
        try {
             const {id, username} = req.params
             console.log(id, username)
            //Checking UUID Validity
            if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }
            //Conditioning username empty or undefined
            if(username === ":username") {
                next({name: 'Bad Request', message: 'Username cannot empty' })
                return 
            }
            //Checking username registered in database
            const usernameValidator = await Checking.userValidityByUsername(username)
            if(!usernameValidator) {
                next({name: 'Bad Request', message: 'Username not found'})
                return
            }
            //Checking users in database
            const user = await Users.findOne({where:{id}})
            if(!user) {
                next({name: 'Not Found', message: 'User Not Found'})
                return
            }
            //Checking authority
            if(!user.is_admin) {
                next({name: 'Unauthorized', message: 'Unauthorized, Only Admin'})
                return
            }

            await Users.destroy({where:{username}})
            res.status(201).json({message: `User has been deleted`})
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
 }

 module.exports = UserController