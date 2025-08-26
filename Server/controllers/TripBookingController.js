'use strict'

const validator = require('validator');
const Checking = require('../helpers/MyValidator');
const { TripBookings, OpenTrips, Users } = require('../models');

class TripBookingController {
    static async createTripBooking (req, res, next) {
        try {
            const {id, OpenTripId} = req.params
            const {TripDateId} = req.body

            //Checking UUID Validity
            if(!validator.isUUID(id) || id === ':id') {
                next({name: 'Bad Request', message: 'Invalid or missing UUID' })
                return 
            }
            
            //Checking registered user
             const user = await Users.findByPk(id, {include:[{model:TripBookings}]})
            if(!user) {
                next({name: "Not Found", message: 'User Not Found'})
                return
            }

            //Checking and gather Open Trip data
            const openTripsData = await OpenTrips.findByPk(OpenTripId)
            if (!openTripsData) {
                next({name: "Not Found", message: 'Open Trip Not Found'})
                return
            }

            //Checking if user already booking trip
            const alreadyBooking = user.TripBookings && user.TripBookings.some(booking => booking.UserId === id)
            if (alreadyBooking) {
                next({name: "Conflict", message: 'You can only Bookings 1 time'})
                return
            }

            //Checking TripDateId is defined
            if(!TripDateId) {
                next({name: "Bad Request", message: 'Please Choose your trip depature date'})
                return
            }

            //Defined TripBooking form
            const tripBookingForm = {
                UserId:id, 
                OpenTripId,
                pax_count: 1,
                total_price: openTripsData.price,
                status: 'pending',
                booked_at: new Date (),
                TripDateId
            }

            //Checking mandatory form data
            for (let key in tripBookingForm) {
                if(!tripBookingForm[key]) {
                    next({name: 'Bad Request', message: `please insert ${key}` })
                    return
                }
            }

            //Process creating TripBooking
            await TripBookings.create(tripBookingForm)
            res.status(201).json({message: `Trip Booking Successfully`})

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }

    static async deleteTripBooking (req, res, next) {
        try {
            const {id, OpenTripId, tripBookingId} = req.params
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

            //Checking TripBooking Availability
            const getTripBooking =  await TripBookings.findByPk(tripBookingId)
            if(!getTripBooking) {
                next({name: "Not Found", message: 'Trip Booking Not Found'})
                return
            }

            //Checking update Auth
            const checkingAuth = getTripBooking.UserId === id
            if(!checkingAuth) {
                next({name: "Forbidden", message: 'unAuthorized Action'})
                return
            }

            //Deleting Process
            await TripBookings.destroy({where:{id:tripBookingId}})
            res.status(200).json({message: `Trip Booking has been deleted`})
        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
}

module.exports = TripBookingController