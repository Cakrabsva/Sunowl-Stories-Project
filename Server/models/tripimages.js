'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TripImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TripImages.belongsTo(models.OpenTrips, {
        foreignKey: 'OpenTripId'
      })
    }
  }
  TripImages.init({
    OpenTripId: DataTypes.INTEGER,
    image_url: DataTypes.TEXT,
    caption: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'TripImages',
  });
  return TripImages;
};