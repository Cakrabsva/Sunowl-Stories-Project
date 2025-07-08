'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/hashPassword');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasOne(models.Profiles, {
        foreignKey: 'UserId',
        as: 'profile',
        onDelete:'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Users.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }, 
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    }, 
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [8,20],
          msg: 'Password minimum 8 characters'
        }
      }
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: true
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: true
      }
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: true
      }
    },
    username_updatedAt: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true
      }
    },
    update_token: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }
    },
  }, {
    sequelize,
    modelName: 'Users',
    hooks: {
      beforeCreate: (instance, option) => {
        instance.password = hashPassword(instance.password)
      }
    }
  });
  return Users;
};