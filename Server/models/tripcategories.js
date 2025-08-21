'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TripCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TripCategories.hasMany(models.OpenTrips, {foreignKey:'TripCategoryId'})
    }
  }
  TripCategories.init({
    category_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TripCategories',
  });
  return TripCategories;
};