'use strict'

const router = require('express').Router()
const ProfileController = require('../controllers/ProfilesController')
const Permission = require('../helpers/Permission')

router.post('/:id/edit-profile', Permission.userAuthentication, Permission.userAuthorization, ProfileController.editProfile)

module.exports = router