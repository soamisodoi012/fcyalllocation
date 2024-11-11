const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User=require('./user');
const Branch = require('./branch');
//const Currency = require('./currency');
  const LiveFcyAllocation = sequelize.define('FcyLiveAllocation', {
    queueNumber: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    importerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    importerNBEAccNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    importerTIN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    importerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hsCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proformaNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    proformaCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proformaAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    equivalentUsd:{
      type: DataTypes.FLOAT,
      allowNull:true,
    },
    applicationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    queueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    proformaDate:{
      type:DataTypes.DATE,
      allowNull: false,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
     },
    modeOfPayment: {
      type: DataTypes.ENUM('CAD', 'TT', 'LC'),
      allowNull: false,
    },
    approvedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,  // Automatically set to the current date/time
    },
    status: {
      type: DataTypes.STRING,
     
    },
    immputer: {
      type: DataTypes.STRING,
       allowNull: false,

     },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps:false,
    hooks: {
      
      beforeCreate: (allocation) => {
        allocation.status = 'approved';  // Set status automatically
      },
    },
    
  });
  // LiveFcyAllocation.associate = function(models) {
  //   LiveFcyAllocation.belongsTo(models.Branch, { foreignKey: 'branchCode' });
  //   LiveFcyAllocation.belongsTo(models.Currency,{ foreignKey: 'currencyCode'})
  // };
  
  module.exports=LiveFcyAllocation;

