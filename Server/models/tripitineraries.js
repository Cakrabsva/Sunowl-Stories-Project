'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TripItineraries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TripItineraries.belongsTo(models.OpenTrips, {foreignKey: 'OpenTripId'})
    }
  }
  TripItineraries.init({
    OpenTripId: DataTypes.INTEGER,
    day: DataTypes.INTEGER,
    activity_title: DataTypes.STRING,
    activity_desc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'TripItineraries',
  });
  return TripItineraries;
};