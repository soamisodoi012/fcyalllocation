const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Currency = sequelize.define('Currency', {
  currencyCode: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  currencyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add other relevant fields
}, {
  timestamps: false,
});

module.exports = Currency;