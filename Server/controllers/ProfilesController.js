'use strict'

const validator = require('validator');
const Checking = require('../helpers/MyValidator');
const MyFunction = require('../helpers/MyFunction');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const path = require('path');
const { Profiles } = require('../models');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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

            //Checking born date isBefore today and should more than 16 years old
            const today = new Date ()
            const checkingYearsOld = today.getFullYear() - new Date (born_date).getFullYear()
            const legalYears = 16
            if(checkingYearsOld < legalYears) {
                next({name: "Bad Request", message: 'You must be older than 16 years old'})
                return
            }

            //Updating process
            //Checking first name is defined
            const profileId = user.Profile.id
            if(!first_name) {
                //Checking born_date is defined
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

    static async updateAvatar (req, res, next) {
        try {
            
            // Use upload_stream for buffers
            const fileName = path.parse(req.file.originalname).name
            const uploadStream = cloudinary.uploader.upload_stream(
                { public_id: fileName }, // Options for Cloudinary upload
                async (error, result) => {
                    if (error) {
                        return next({name: "Bad Request", message:error}); // Pass the error to the Express error handler
                    }

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
                    
                    //Checking if user already has avatar url, destroy existing 
                    let lastProfileImgUrl = user.Profile.avatar
                    if(lastProfileImgUrl) {
                        let publicId = MyFunction.getImagePublicId(lastProfileImgUrl)
                        cloudinary.uploader.destroy(publicId)
                    }

                    const cropPic = cloudinary.url(fileName   , {
                        crop: 'auto',
                        gravity: 'auto',
                        width: 500,
                        height: 500,
                    });
                    
                    const profileId = user.Profile.id
                    await Profiles.update({
                        avatar:cropPic
                    }, {
                        where: {id:profileId}
                    })
                    res.status(200).json({message: 'Avatar Updated', url:cropPic})
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
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