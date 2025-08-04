'use strict'

const router = require('express').Router()

router.use('/user', require('./usersRouters'))
router.use('/profile', require('./profilesRouters'))
router.use('/opentrip', require('./openTripRouters'))
router.use('/tripbooking', require('./tripBookingRouters'))
router.use('/tripreview', require('./tripReviewRouters'))
router.use('/tripimage', require('./tripImageRouters'))
router.use('/tripitinerary', require('./tripItineraryRouters'))

module.exports = router