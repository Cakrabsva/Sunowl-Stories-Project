'use strict'

const router = require('express').Router()
const UserController = require('../controllers/usersController')

router.get('/register', UserController.register)
router.get('/login', UserController.login)
router.get('/:id', UserController.getUser)
router.get('/:id/change-email', UserController.changeEmail)
router.get('/:id/change-password', UserController.changePassword)

/* Only Admin */
router.get('/get-all', UserController.getAllUsers)
router.get('/:id/delete', UserController.deleteUser)
router.get('/:id/deactived', UserController.deActivedUser)

module.exports = router