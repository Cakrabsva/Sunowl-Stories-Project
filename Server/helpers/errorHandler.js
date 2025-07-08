'use strict'

function errorHandler (err, req, res, next) {
    switch(err.name) {
        case "SequelizeValidationError":
            case "SequelizeUniqueConstraintError":
                return res.status(400).json({message: err.message})
        default:
            res.status(500).json({ message: 'Internal Server Error' }); 
    }
}

module.exports = errorHandler