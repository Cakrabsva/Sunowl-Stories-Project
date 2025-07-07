'use strict'

const router = require('express').Router()

router.use('/user', require('./usersRouters'))
router.use('/profile', require('./profilesRouters'))

module.exports = router