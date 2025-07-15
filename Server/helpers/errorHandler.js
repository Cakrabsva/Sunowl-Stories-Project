'use strict'

function errorHandler (err, req, res, next) {
    switch(err.name) {
        case "SequelizeValidationError":
            case "SequelizeUniqueConstraintError":
                case "SequelizeDatabaseError":
                    case "Bad Request":
                        return res.status(400).json({message: err.message})
        case "Unauthorized":
            return res.status(401).json({message: err.message})
        case 'Forbidden':
            return res.status(403).json({message: err.message})
        case "Not Found":
            return res.status(404).json({message: err.message})
        case "Conflict":
            return res.status(409).json({message: err.message})
        default:
            res.status(500).json({ message: 'Internal Server Error' }); 
    }
}

module.exports = errorHandler