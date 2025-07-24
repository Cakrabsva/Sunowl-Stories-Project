'use strict';
const {
  Model
} = require('sequelize');
const { Password } = require('../helpers/Password');
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
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username already exist!'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please insert your username'
        },
      }
    }, 
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
      unique: {
        args: true,
        msg: 'Email already exist!'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please insert your email'
        },
        isEmail: {
          args: true,
          msg: 'Invalid email format'
        }
      }
    }, 
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please insert your password'
        },
        len: {
          args: [8],
          msg: 'Password minimum 8 characters'
        }
      }
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        notEmpty: true
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        notEmpty: true
      }
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    token_updatedAt: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true
      }
    },
    update_token: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      validate: {
        notEmpty: false
      }
    },
  }, {
    sequelize,
    modelName: 'Users',
    hooks: {
      beforeCreate: (instance, option) => {
        instance.password = Password.hashPassword(instance.password)
      },
      beforeUpdate: (instance) => {
        instance.password = Password.hashPassword(instance.password)
      },
    }
  });
  return Users;
};