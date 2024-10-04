const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Session = sequelize.define('Session', {
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'username',
    },
    primaryKey:true,
  },
  loginAt:{
    type:DataTypes.DATE,
    allowNull:false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add other relevant fields
}, {
  timestamps: false,
  hooks: {
    beforeCreate: (allocation) => {
      allocation.loginAt = Date.now;  // Set status automatically
    },
  },
});
Session.belongsTo(User, { foreignKey: 'user' });
module.exports = Session;
