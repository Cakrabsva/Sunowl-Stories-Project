'use strict'

const { Jwt } = require("./Jasonwebtoken")
const { Users } = require("../models")

class Permission {
    static async userAuthentication (req, res, next) {
        try {
            const bearerToken = req.headers.authorization
            if(!bearerToken) {
                next({name: 'Unauthorized', message: 'Login First'})
                return
            }

            const token = bearerToken.split(' ')[1]
            const decodedToken = Jwt.verifyToken(token)
            const user = await Users.findByPk(decodedToken.id)

            if(!user) {
                next({name: 'Not Found', message: 'User Not Found'})
                return
            }

            req.user = user
            next()
            
        } catch (err) {
            next(err)
        }
    }

    static async userAuthorization (req, res, next) {
        try {
            let userLoginId = req.user.id
            let idRequest = req.params.id
            if(!userLoginId || !idRequest) {
                next({name: 'Bad Request', message: 'Misiing ID'})
                return
            }

            userLoginId !== idRequest ? next ({name: 'Forbidden', message: 'You have no permission'}) :
            next()
        } catch (err) {
            next(err)
        }
    }

    static async adminAuthorization (req, res, next) {
        try {
            const loginUser = req.user
            const adminChecker = loginUser.is_admin
            if(!adminChecker) {
                next ({name: 'Forbidden', message: 'Only Admin Allowed'})
            }
            next()
        } catch (err) {
            next(err)
        }
    }
}

module.exports = Permission