const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User=require('./user');
const Branch = require('./branch');
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
    importedItem: {
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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    applicationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // branch: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    branchCode: {  // Foreign key for Branch
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Branch,
        key: 'branchCode',
      },
    },
    modeOfPayment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,  // Automatically set to the current date/time
    },
    status: {
      type: DataTypes.STRING,
     
    },
    // approvedBy: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   references: {
    //     model: User,
    //     key: 'username',
    //   },
    // },
  }, {
    timestamps:false,
    hooks: {
      beforeCreate: (allocation) => {
        allocation.status = 'approved';  // Set status automatically
      },
    },
  });
  LiveFcyAllocation.associate = function(models) {
    LiveFcyAllocation.belongsTo(models.Branch, { foreignKey: 'branchCode' });
  };
  
  module.exports=LiveFcyAllocation;

