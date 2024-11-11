const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const UnauthorizedFcyAllocation = require('./FcyInAu');

const Notification = sequelize.define('Notification', {
    queueNumber:{
    type: DataTypes.STRING,
    allowNull: false,
    references: {
        model: UnauthorizedFcyAllocation,
        key: 'queueNumber',
      },
      primaryKey:false,
    },
  rejectedby:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  imputer:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  rejectionReason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  remark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Add other relevant fields
}, {
  timestamps: false,
});
Notification.belongsTo(UnauthorizedFcyAllocation, { foreignKey: 'queueNumber' });
module.exports = Notification;
