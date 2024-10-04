const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');
const Permission = require('./permission');

const RolePermission = sequelize.define('RolePermission', {
  roleId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Role,
      key: 'roleName',
    },
    primaryKey: true,  // Composite primary key
  },
  permissionId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Permission,
      key: 'permissionName',
    },
    primaryKey: true,  // Composite primary key
  },
}, {
  timestamps: false,
  freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
  tableName: 'RolePermission',  // Explicitly set table name
  // Explicitly tell Sequelize not to create an `id` field
  indexes: [
    {
      unique: true,
      fields: ['roleId', 'permissionId']
    }
  ]
});

module.exports = RolePermission;
