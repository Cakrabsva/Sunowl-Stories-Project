'use strict'

const router = require('express').Router()
const OpenTripController = require('../controllers/OpenTripController')
const Permission = require('../helpers/Permission')

router.get('/', OpenTripController.getAllOpenTrips)
router.post('/create-opentrip', OpenTripController.createOpenTrip)
router.post('/:id/delete-opentrip', OpenTripController.deleteOpenTrip)
router.post('/:id/update-opentrip', OpenTripController.updateOpenTrip)

module.exports = router