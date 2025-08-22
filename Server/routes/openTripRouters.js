'use strict'

const router = require('express').Router()
const OpenTripController = require('../controllers/OpenTripController')
const Permission = require('../helpers/Permission')

router.get('/:id', Permission.userAuthentication, Permission.userAuthorization, OpenTripController.getAllOpenTrips)
router.get('/:id/:tripId', Permission.userAuthentication, Permission.userAuthorization, OpenTripController.getOneOpenTrip)
router.post('/:id/create-opentrip',Permission.userAuthentication, Permission.userAuthorization, Permission.adminAuthorization, OpenTripController.createOpenTrip)
router.post('/:id/:tripId/update-opentrip',Permission.userAuthentication, Permission.userAuthorization, Permission.adminAuthorization, OpenTripController.updateOpenTrip)
router.delete('/:id/:tripId/delete-opentrip',Permission.userAuthentication, Permission.userAuthorization, Permission.adminAuthorization, OpenTripController.deleteOpenTrip)

module.exports = router