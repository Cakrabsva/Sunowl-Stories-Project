'use strict'

const router = require('express').Router()
const TripDatesController = require('../controllers/tripDatesController')
const Permission = require('../helpers/Permission')

router.get('/:id/:OpenTripId/get-all-tripDates',Permission.userAuthentication, Permission.userAuthorization,TripDatesController.getAllTripDates)
// router.post('/:id/:OpenTripId/create-tripDates',Permission.userAuthentication, Permission.userAuthorization,)
// router.post('/:id/:tripDateId/update-tripDates',Permission.userAuthentication, Permission.userAuthorization,)
// router.delete('/:id/:tripDateId/delete-tripDates',Permission.userAuthentication, Permission.userAuthorization,)

module.exports = router