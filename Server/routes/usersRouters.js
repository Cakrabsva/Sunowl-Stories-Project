'use strict'

const router = require('express').Router()
const UserController = require('../controllers/usersController')

router.get('/register', UserController.register)

module.exports = router