'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TripDates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TripDates.belongsTo(models.OpenTrips, {foreignKey: 'OpenTripId'})
      TripDates.hasMany(models.TripBookings, {foreignKey:'TripDateId'})
    }
  }
  TripDates.init({
    OpenTripId: DataTypes.INTEGER,
    departure_date: DataTypes.DATE,
    return_date: DataTypes.DATE,
    quota: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TripDates',
  });
  return TripDates;
};