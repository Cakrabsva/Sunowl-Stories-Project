'use strict'

const router = require('express').Router()
const tripBookingController = require('../controllers/TripBookingController')
const Permission = require('../helpers/Permission')

router.get('/:id/get-my-tripbookings',Permission.userAuthentication, Permission.userAuthorization, tripBookingController.getMyTripBookings)
router.get('/:id/:OpenTripId/get-opentripbookings',Permission.userAuthentication, Permission.userAuthorization, tripBookingController.getOpenTripBookings)
router.post('/:id/:OpenTripId/:TripDateId/create-tripbooking',Permission.userAuthentication, Permission.userAuthorization,tripBookingController.createTripBooking)
router.delete('/:id/:OpenTripId/:tripBookingId/delete-tripbooking',Permission.userAuthentication, Permission.userAuthorization, tripBookingController.deleteTripBooking)

module.exports = router