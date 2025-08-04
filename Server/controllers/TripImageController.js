'use strict'

class TripImageController {
    static async getAllTripImages (req, res, next) {
        try {

            } catch (err) {
                err.name === 'SequelizeValidationError' || 
                err.name === 'SequelizeUniqueConstraintError' ||
                err.name === 'SequelizeDatabaseError' ?
                next({name: err.name, message: err.errors[0].message}) : next(err)
            }        
        }
    static async createTripImage (req, res, next) {
        try {

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
    static async updateTripImage (req, res, next) {
        try {

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
    static async deleteTripImage (req, res, next) {
        try {

        } catch (err) {
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
}