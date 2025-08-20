'use strict'

const router = require('express').Router()
const TripItineraryController = require('../controllers/TripItineraryController')
const Permission = require('../helpers/Permission')

router.get('/:id', Permission.userAuthentication, Permission.userAuthorization, Permission.adminAuthorization,)
router.post('/:id/:OpenTripId/create-tripitinerary',Permission.userAuthentication, Permission.userAuthorization, Permission.adminAuthorization,TripItineraryController.createTripItinerary)
router.post('/:id/:tripItineraryId/update-tripitinerary',Permission.userAuthentication, Permission.userAuthorization, Permission.adminAuthorization, TripItineraryController.updateTripItinerary)
router.delete('/:id/:tripItineraryId/delete-tripitinerary',Permission.userAuthentication, Permission.userAuthorization, Permission.adminAuthorization, TripItineraryController.deleteTripItinerary)

module.exports = router