'use strict'

const router = require('express').Router()
const tripBookingController = require('../controllers/TripBookingController')
const Permission = require('../helpers/Permission')

router.post('/:id/:OpenTripId/:tripBookingId/create-tripbooking',Permission.userAuthentication, Permission.userAuthorization,tripBookingController.createTripBooking)
router.delete('/:id/:OpenTripId/:tripBookingId/delete-tripbooking',Permission.userAuthentication, Permission.userAuthorization, tripBookingController.deleteTripBooking)

module.exports = router