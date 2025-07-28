'use strict'

const router = require('express').Router()
const ProfileController = require('../controllers/ProfilesController')
const Permission = require('../helpers/Permission')
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

router.post('/:id/edit-profile', Permission.userAuthentication, Permission.userAuthorization, ProfileController.editProfile)
router.patch('/:id/avatar-url', Permission.userAuthentication, Permission.userAuthorization, upload.single('avatar'), ProfileController.updateAvatar)

module.exports = router