const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Branch = sequelize.define('Branch', {
  branchCode: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  branchName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add other relevant fields
}, {
  timestamps: false,
});

module.exports = Branch;