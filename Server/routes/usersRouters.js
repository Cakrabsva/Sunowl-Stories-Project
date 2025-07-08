'use strict'

const router = require('express').Router()
const UserController = require('../controllers/UsersController')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/:username', UserController.getUser)
router.get('/:username/change-email', UserController.changeEmail)
router.get('/:username/change-password', UserController.changePassword)

/* Only Admin */
router.get('/get-all', UserController.getAllUsers)
router.get('/:id/delete', UserController.deleteUser)
router.get('/:id/deactived', UserController.deActivedUser)

module.exports = router