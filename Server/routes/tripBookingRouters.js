'use strict'

const router = require('express').Router()
const tripBookingController = require('../controllers/TripBookingController')
const Permission = require('../helpers/Permission')

module.exports = router