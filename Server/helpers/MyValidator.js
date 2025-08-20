'use strict';

const {Users, Profiles, OpenTrips} = require('../models');

class Checking {
    static async userValidity(id) {
        const user = await Users.findByPk(id, {include:[{model:Profiles}]})
        return user
    }
    static async userValidityByUsername(username) {
        const user = await Users.findOne({where:{username}})
        return user
    }

    static async openTripValidityById(id) {
        const user = await OpenTrips.findByPk(id)
        return user
    }
}

module.exports = Checking