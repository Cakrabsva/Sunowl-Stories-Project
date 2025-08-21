'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TripBookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TripBookings.belongsTo(models.OpenTrips, { foreignKey: 'OpenTripId' });
      TripBookings.belongsTo(models.Users, { foreignKey: 'UserId' });
    }
  }
  TripBookings.init({
    OpenTripId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    pax_count: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    status: DataTypes.STRING,
    booked_at: DataTypes.DATE,
    TripDateId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TripBookings',
  });
  return TripBookings;
};