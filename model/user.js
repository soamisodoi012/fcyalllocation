const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Password@123', // Default password before hashing
  },
  isPasswordChanged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Default to false when the user is created
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isLogin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isReseted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: { // Changed from 'role' to 'roleId' to reference the role's primary key
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Role,
      key: 'roleName',
    },
  },
}, {
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      // Hash the password before saving the user
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Define the relationship
module.exports = User;
