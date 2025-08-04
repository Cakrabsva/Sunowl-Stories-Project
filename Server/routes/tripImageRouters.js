'use strict'

const router = require('express').Router()
const tripImageController = require('../controllers/TripImageController')
const Permission = require('../helpers/Permission')

module.exports = router