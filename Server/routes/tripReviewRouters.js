'use strict'

const router = require('express').Router()
const tripReviewController = require('../controllers/TripReviewsController')
const Permission = require('../helpers/Permission')

router.get('/:id/:OpenTripId/get-all-tripReviews',Permission.userAuthentication, Permission.userAuthorization, tripReviewController.getAllTripReviews)
router.post('/:id/:OpenTripId/create-tripReview',Permission.userAuthentication, Permission.userAuthorization, tripReviewController.createTripReview)
router.post('/:id/:tripReviewId/update-tripReview',Permission.userAuthentication, Permission.userAuthorization, tripReviewController.updateTripReview)
router.delete('/:id/:tripReviewId/delete-tripReview',Permission.userAuthentication, Permission.userAuthorization, tripReviewController.deleteTripReview)

module.exports = router