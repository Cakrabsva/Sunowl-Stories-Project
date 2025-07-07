'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profiles.belongsTo(models.Users, {
        foreignKey: 'UserId',
        as: 'user',
        onDelete:'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }
  Profiles.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    bio: DataTypes.TEXT,
    gender: DataTypes.STRING,
    born_date: {
      type: DataTypes.DATE,
      validate: {
        isAfter: new Date ()
      }
    }, 
    avatar: {
      type:DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profiles',
  });
  return Profiles;
};