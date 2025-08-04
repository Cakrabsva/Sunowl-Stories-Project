'use strict'

const router = require('express').Router()
const tripReviewController = require('../controllers/TripReviewsController')
const Permission = require('../helpers/Permission')

module.exports = router