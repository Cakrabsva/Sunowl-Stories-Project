'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OpenTrips extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OpenTrips.hasMany(models.TripItineraries, {foreignKey:'OpenTripId'})
      OpenTrips.hasMany(models.TripImages, {foreignKey:'OpenTripId'})
      OpenTrips.hasMany(models.TripReviews, {foreignKey:'OpenTripId'})
      OpenTrips.hasMany(models.TripBookings, {foreignKey:'OpenTripId'})
      OpenTrips.hasMany(models.TripDates, {foreignKey:'OpenTripId'})
      OpenTrips.belongsTo(models.TripCategories, {foreignKey:'TripCategoryId'})
    }
  }
  OpenTrips.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    price: DataTypes.INTEGER,
    duration_days: DataTypes.INTEGER,
    duration_nights: DataTypes.INTEGER,
    rating: DataTypes.FLOAT,
    image_url: DataTypes.TEXT,
    available_slots: DataTypes.INTEGER,
    departure_date: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN,
    min_slots: DataTypes.INTEGER,
    max_slots: DataTypes.INTEGER,
    TripCategoryId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'OpenTrips',
  });
  return OpenTrips;
};