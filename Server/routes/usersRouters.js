'use strict'

const router = require('express').Router()
const UserController = require('../controllers/UsersController')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.get('/:id', UserController.getUser)
router.post('/:id/change-email', UserController.changeEmail)
router.post('/:id/change-password', UserController.changePassword)
router.post('/:id/change-username', UserController.changeUsername)

router.post('/:id/verified', UserController.verifyUser)
router.post('/:id/update-token', UserController.updateToken)

//!Only Admin
router.get('/:id/get-all', UserController.getAllUsers)
router.post('/:id/:username/change-role', UserController.changeRole)
router.post('/:id/:username/deactived', UserController.deActivedUser)
router.post('/:id/:username/delete', UserController.deleteUser)

module.exports = router