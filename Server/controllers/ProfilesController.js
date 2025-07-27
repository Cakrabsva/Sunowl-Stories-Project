'use strict'

const validator = require('validator');
const Checking = require('../helpers/MyValidator');
const {Profiles} = require('../models');
const MyFunction = require('../helpers/MyFunction');

class ProfileController {
    static async editProfile (req, res, next) {
        try {
            const {id} = req.params
            const firstNameGenetrator = MyFunction.firstNameGenetrator(id)
            const {first_name, last_name, born_date, gender, bio} = req.body

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

            //Updating process
            const profileId = user.Profile.id

            //Checking username is defined
            if(!first_name) {
                //Checking bord_date is defined
                if(!born_date) {
                    await Profiles.update({first_name:firstNameGenetrator, last_name, gender, bio}, {
                        where: {id:profileId}
                    })
                    res.status(201).json({message: 'Profile Updated Successfully!'})
    
                } else {
                    await Profiles.update({first_name:firstNameGenetrator, last_name, born_date, gender, bio}, {
                        where: {id:profileId}
                    })
                    res.status(201).json({message: 'Profile Updated Successfully!'})
                }
            } else {
                //Checking bord_date is defined
                if(!born_date) {
                    await Profiles.update({first_name, last_name, gender, bio}, {
                        where: {id:profileId}
                    })
                    res.status(201).json({message: 'Profile Updated Successfully!'})
    
                } else {
                    await Profiles.update({first_name, last_name, born_date, gender, bio}, {
                        where: {id:profileId}
                    })
                    res.status(201).json({message: 'Profile Updated Successfully!'})
                }
            }

            
        } catch (err) {
            console.log(err)
            err.name === 'SequelizeValidationError' || 
            err.name === 'SequelizeUniqueConstraintError' ||
            err.name === 'SequelizeDatabaseError' ?
            next({name: err.name, message: err.errors[0].message}) : next(err)
        }
    }
}

module.exports = ProfileController