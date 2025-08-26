'use strict'

const validator = require('validator');
const Checking = require('../helpers/MyValidator');
const { TripDates } = require('../models');

class TripDatesController {
    static async getAllTripDates (req, res, next) {
        try {
            const {id, OpenTripId} = req.params
            //Checking UUID Validity
            if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }

            //Checking registered user
            const user = await Checking.userValidity(id)
            if(!user) {
                next({name: "Not Found", message: 'User Not Found'})
                return
            }

            //Getting all trip reviews
            const tripDates = await TripDates.findAll({
                where: { OpenTripId },
            })
            res.status(200).json({message: 'You get all the trip reviews', data:  tripDates})
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    // static async createTripReview (req, res, next) {
    //     try {
    //         const {rating, review_text} = req.body
    //         const {id, OpenTripId} = req.params
    //         const form = {UserId:id, OpenTripId, rating, review_text}

    //         //Checking mandatory form data
    //         for (let key in form) {
    //             if(!form[key]) {
    //                 next({name: 'Bad Request', message: `please insert ${key}` })
    //                 return
    //             }
    //         }

    //         //Checking UUID Validity
    //         if(!validator.isUUID(id) || id === ':id') {
    //             next({name: 'Bad Request', message: 'Invalid or missing UUID' })
    //             return 
    //         }
            
    //         //Checking registered user
    //         const user = await Checking.userValidity(id)
    //         if(!user) {
    //             next({name: "Not Found", message: 'User Not Found'})
    //             return
    //         }

    //         //Checking if user already gave a review or not
    //         const openTripsData = await OpenTrips.findByPk(OpenTripId, {include: [{model: TripReviews}]})
    //         if (!openTripsData) {
    //             next({name: "Not Found", message: 'Open Trip Not Found'})
    //             return
    //         }
    //         const alreadyReviewed = openTripsData.TripReviews && openTripsData.TripReviews.some(review => review.UserId === id)
    //         if (alreadyReviewed) {
    //             next({name: "Conflict", message: 'You can only review 1 time'})
    //             return
    //         }

    //         //Process creating Trip Itinerary
    //         await TripReviews.create(form)
    //         res.status(201).json({message: `Trip Review Posted`})

    //     } catch (err) {
    //         err.name === 'SequelizeValidationError' || 
    //         err.name === 'SequelizeUniqueConstraintError' ||
    //         err.name === 'SequelizeDatabaseError' ?
    //         next({name: err.name, message: err.errors[0].message}) : next(err)
    //     }
    // }

    // static async updateTripReview (req, res, next) {
    //     try {
    //         const {rating, review_text} = req.body
    //         const {id, tripReviewId} = req.params
    //         const updateForm = {rating, review_text}

    //         //Checking UUID Validity
    //         if(!validator.isUUID(id) || id === ':id') {
    //             next({name: 'Bad Request', message: 'Invalid or missing UUID' })
    //             return 
    //         }
            
    //         //Checking registered user
    //         const user = await Checking.userValidity(id)
    //         if(!user) {
    //             next({name: "Not Found", message: 'User Not Found'})
    //             return
    //         }

    //         //Checking TripReview Availability
    //         const getTripReview =  await TripReviews.findOne({where:{id:tripReviewId}})
    //         if(!getTripReview) {
    //             next({name: "Not Found", message: 'Review Not Found'})
    //             return
    //         }

    //         //Checking update Auth
    //         const checkingAuth = getTripReview.UserId === id
    //         if(!checkingAuth) {
    //             next({name: "Forbidden", message: 'unAuthorized Action'})
    //             return
    //         }

    //         //process Update
    //         await TripReviews.update(updateForm, {where: {id:tripReviewId}})
    //         res.status(201).json({message: `Review updated`})

    //     } catch (err) {
    //         err.name === 'SequelizeValidationError' || 
    //         err.name === 'SequelizeUniqueConstraintError' ||
    //         err.name === 'SequelizeDatabaseError' ?
    //         next({name: err.name, message: err.errors[0].message}) : next(err)
    //     }
    // }
    
    // static async deleteTripReview (req, res, next) {
    //     try {

    //         const {id, tripReviewId} = req.params
    //         //Checking UUID Validity
    //         if(!validator.isUUID(id) || id === ':id') {
    //             next({name: 'Bad Request', message: 'Invalid or missing UUID' })
    //             return 
    //         }
            
    //         //Checking registered user
    //         const user = await Checking.userValidity(id)
    //         if(!user) {
    //             next({name: "Not Found", message: 'User Not Found'})
    //             return
    //         }

    //         //Checking TripReview Availability
    //         const getTripReview =  await TripReviews.findOne({where:{id:tripReviewId}})
    //         if(!getTripReview) {
    //             next({name: "Not Found", message: 'Review Not Found'})
    //             return
    //         }

    //         //Checking update Auth
    //         const checkingAuth = getTripReview.UserId === id
    //         if(!checkingAuth) {
    //             next({name: "Forbidden", message: 'unAuthorized Action'})
    //             return
    //         }

    //         //Deleting Process
    //         await TripReviews.destroy({where:{id:tripReviewId}})
    //         res.status(200).json({message: `Review has been deleted`})
    //     } catch (err) {
    //         err.name === 'SequelizeValidationError' || 
    //         err.name === 'SequelizeUniqueConstraintError' ||
    //         err.name === 'SequelizeDatabaseError' ?
    //         next({name: err.name, message: err.errors[0].message}) : next(err)
    //     }
    // }
}

module.exports = TripDatesController