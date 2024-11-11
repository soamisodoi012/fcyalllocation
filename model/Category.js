const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category=sequelize.define('Category', {
    categoryCode: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    categoryName:{
        type: DataTypes.STRING,
        allowNull: false,
     },
     }, {
       timestamps: false,
     });

    module.exports =Category