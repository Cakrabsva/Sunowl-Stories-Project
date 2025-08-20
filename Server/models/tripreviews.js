'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TripReviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TripReviews.belongsTo(models.OpenTrips, { foreignKey: 'OpenTripId' });
      TripReviews.belongsTo(models.Users, { foreignKey: 'UserId' });
    }
  }
  TripReviews.init({
    OpenTripId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    review_text: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'TripReviews',
  });
  return TripReviews;
};