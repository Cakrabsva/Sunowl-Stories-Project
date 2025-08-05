'use strict'

const validator = require('validator');
const Checking = require('../helpers/MyValidator');
const { TripItineraries } = require('../models');

class TripItineraryController {
    static async createTripItinerary (req, res, next) {
        try {
            const {day, activity_title, activity_desc} = req.body
            const {id, OpenTripId} = req.params
            const form = {
                OpenTripId,
                day,
                activity_title,
                activity_desc
            }

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

            //Process creating Trip Itinerary
            await TripItineraries.create(form)
            res.status(201).json({message: `Trip Itinerary Created Successfully`})

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
    static async updateTripItinerary (req, res, next) {
        try {
            const { id,  tripItineraryId } = req.params
            const { day, activity_title, activity_desc } = req.body
            const formUpdate = { 
                day,
                activity_title,
                activity_desc
            }

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

            //Process Update
            await TripItineraries.update(formUpdate,{
                where: {id: tripItineraryId}
            })
            res.status(201).json({message: `Trip Itinerary has been updated`})

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
    static async deleteTripItinerary (req, res, next) {
        try {
            const { id,  tripItineraryId } = req.params

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

            //Deleting process
            await TripItineraries.destroy({where:{id:tripItineraryId}})
            res.status(200).json({message: `Trip itinerary has been deleted`})

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
}

module.exports = TripItineraryController