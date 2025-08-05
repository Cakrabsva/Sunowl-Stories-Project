'use strict'

const validator = require('validator');
const Checking = require('../helpers/MyValidator');
const { OpenTrips, TripItineraries } = require('../models');

class OpenTripController {
    static async getOneOpenTrip (req, res, next) {
        try {
            const{id, tripId} = req.params 
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

            //Getting all open trips
            const openTrips = await OpenTrips.findByPk(tripId, {include:[{model:TripItineraries}]})
            res.status(200).json({message: 'You get the Open Trips', data:  openTrips})
        } catch (err) {
            console.log(err)
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async getAllOpenTrips (req, res, next) {
        try {
            const {id} = req.params
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

            //Getting all open trips
            const openTrips = await OpenTrips.findAll()
            res.status(200).json({message: 'You get all the Open Trips', data:  openTrips})
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async createOpenTrip (req, res, next) {
        try {
            const {title, description, location, price, duration_days, duration_nights, rating,image_url, available_slots, departure_date} = req.body
            const {id} = req.params
            const form = {
                title, 
                description, 
                location, 
                price, 
                duration_days, 
                duration_nights, 
                rating,image_url, 
                available_slots, 
                departure_date
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

            //Process Create Open Trip
            await OpenTrips.create(form)
            res.status(201).json({message: `Open Trip to ${title} Created Successfully`})
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async updateOpenTrip (req, res, next) {
        try {
            const { id,  tripId } = req.params
            const {title, description, location, price, duration_days, duration_nights, rating,image_url, available_slots, departure_date} = req.body
            const formUpdate = {
                title, 
                description, 
                location, 
                price, 
                duration_days, 
                duration_nights, 
                rating,image_url, 
                available_slots, 
                departure_date
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

            //Checking Open Trip validity
            const openTrip = await Checking.openTripValidityById(tripId)
            if(!openTrip) {
                next({name: "Not Found", message: 'Open Trip Not Found'})
                return
            }

            //Process Update
            await OpenTrips.update(formUpdate,{
                where: {id: tripId}
            })
            res.status(201).json({message: `${openTrip.title} has been updated`})

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
    
    static async deleteOpenTrip (req, res, next) {
        try {
            const { id,  tripId } = req.params

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

            //Checking Open Trip validity
            const openTrip = await Checking.openTripValidityById(tripId)
            if(!openTrip) {
                next({name: "Not Found", message: 'Open Trip Not Found'})
                return
            }

            //process Delete Open Trip
            await OpenTrips.destroy({where:{id:tripId}})
            res.status(200).json({message: `${openTrip.title} has been deleted`})

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
}

module.exports = OpenTripController