
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Branch = require('./branch');
const AuthorizedFcyAllocation=require('./FcyLive')
//const Currency = require('./currency');
const  Item  = require('./ItemDetail');
const Category = require('./Category');
const UnauthorizedFcyAllocation = sequelize.define('UnauthorizedFcyAllocation', {
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
    type: DataTypes.INTEGER,
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
  hsCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  item: {  // Foreign key for Branch
    type: DataTypes.STRING,
    allowNull: false,
  },
  category:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  proformaNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:false,
  },
  proformaCurrency: {  // Foreign key for Branch
    type: DataTypes.STRING,
    allowNull: false,
  },
  proformaDate:{
    type:DataTypes.DATE,
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
    allowNull: true,
  },
  queueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  branch: {  // Foreign key for Branch
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Branch,
      key: 'branchCode',
    },
  },
  modeOfPayment: {
        type: DataTypes.ENUM('CAD', 'TT', 'LC'),
        allowNull: false,
      },
  status: {
    type: DataTypes.STRING,
  },
  // rejectionReason: { // Add rejectionReason field
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
   immputer: {
    type: DataTypes.STRING,
     allowNull: false,
     references: {
       model: User,
       key: 'username',
     },
   },
}, 
{
  timestamps: false,
  hooks: {
    beforeCreate: async (allocation) => {
        // Find the last queueNumber from both UnauthorizedFcyAllocation and AuthorizedFcyAllocation
        const [unauthorizedLastEntry, authorizedLastEntry] = await Promise.all([
            UnauthorizedFcyAllocation.findOne({
                order: [['queueNumber', 'DESC']],
            }),
            AuthorizedFcyAllocation.findOne({
                order: [['queueNumber', 'DESC']],
            }),
        ]);

        // Determine the highest queueNumber from both entries
        let lastQueueNumber;
        if (unauthorizedLastEntry && authorizedLastEntry) {
            lastQueueNumber = unauthorizedLastEntry.queueNumber > authorizedLastEntry.queueNumber 
                ? unauthorizedLastEntry.queueNumber 
                : authorizedLastEntry.queueNumber;
        } else if (unauthorizedLastEntry) {
            lastQueueNumber = unauthorizedLastEntry.queueNumber;
        } else if (authorizedLastEntry) {
            lastQueueNumber = authorizedLastEntry.queueNumber;
        }

        let newQueueNumber;
        if (!lastQueueNumber) {
            newQueueNumber = 'GBB_0000000001'; // Start from this value
        } else {
            const numberPart = parseInt(lastQueueNumber.replace('GBB_', ''), 10);
            const nextNumberPart = numberPart + 1;
            newQueueNumber = `GBB_${nextNumberPart.toString().padStart(10, '0')}`;
        }

        console.log("Generated queueNumber:", newQueueNumber); // Debugging log

        allocation.queueNumber = newQueueNumber;  // Set the generated queue number
        allocation.status = "new"; // Set the initial status

        console.log("Allocation after setting queueNumber:", allocation); // Debugging log
    },

    beforeUpdate: async (allocation) => {
      // Set rejectionReason when status changes to 'rejected'
      if (allocation.changed('status') && allocation.status === 'rejected') {
        allocation.rejectionReason = allocation.rejectionReason || 'Rejected due to unspecified reasons';
      }
    }
  }
});

// Association with User model
UnauthorizedFcyAllocation.associate = function(models) {
   UnauthorizedFcyAllocation.hasMany(models.User, { as: 'immputer', foreignKey: 'username' });
  UnauthorizedFcyAllocation.belongsTo(models.Branch, { foreignKey: 'branchCode' });
  // UnauthorizedFcyAllocation.belongsTo(models.Item,{ foreignKey: 'itemCode' });
};

module.exports = UnauthorizedFcyAllocation;
