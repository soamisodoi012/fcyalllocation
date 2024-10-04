// model/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPasswordChanged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Default to false when the user is created
  },
  passwordExpirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  roleId: { // Changed from 'role' to 'roleId' to reference the role's primary key
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Role,
      key: 'roleName',
    },
  },
}, {
  timestamps: false,
});

// Define the relationship

module.exports = User;
