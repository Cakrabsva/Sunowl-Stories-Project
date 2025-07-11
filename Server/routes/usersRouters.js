'use strict'

const router = require('express').Router()
const UserController = require('../controllers/UsersController')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

//!Only Admin
router.get('/get-all', UserController.getAllUsers)

router.get('/:id', UserController.getUser)
router.post('/:username/change-email', UserController.changeEmail)
router.post('/:username/change-password', UserController.changePassword)
router.post('/:username/change-username', UserController.changeUsername)
router.post('/:username/verified', UserController.verifyUser)
router.post('/:username/update-token', UserController.updateToken)

//!Only Admin
router.get('/:id/deactived', UserController.deActivedUser)
router.get('/:id/delete', UserController.deleteUser)


module.exports = router