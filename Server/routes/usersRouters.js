'use strict'

const router = require('express').Router()
const UserController = require('../controllers/UsersController')
const Permission = require('../helpers/Permission')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/forgot-password',UserController.forgotPassword)

router.get('/:id', UserController.getUser)
router.post('/:id/change-email',Permission.userAuthentication, Permission.userAuthorization, UserController.changeEmail)
router.post('/:id/change-password',Permission.userAuthentication, Permission.userAuthorization,  UserController.changePassword)
router.post('/:id/reset-password',UserController.resetPassword)
router.post('/:id/change-username',Permission.userAuthentication, Permission.userAuthorization, UserController.changeUsername)

router.post('/:id/verified', UserController.verifyUser)
router.post('/:id/update-token', UserController.updateToken)

//!Only Admin
router.get('/:id/get-all',Permission.userAuthentication, Permission.adminAuthorization, UserController.getAllUsers)
router.post('/:id/:username/change-role',Permission.userAuthentication, Permission.adminAuthorization, UserController.changeRole)
router.post('/:id/:username/deactived',Permission.userAuthentication, Permission.adminAuthorization, UserController.changeStatusUser)
router.delete('/:id/:username/delete',Permission.userAuthentication, Permission.adminAuthorization, UserController.deleteUser)

module.exports = router