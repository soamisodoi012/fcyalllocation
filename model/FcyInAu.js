// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const User = require('./user');
// const Branch = require('./branch');
// const UnauthorizedFcyAllocation = sequelize.define('UnauthorizedFcyAllocation', {
//   queueNumber: {
//     type: DataTypes.STRING,
//     primaryKey: true,
//     allowNull: false,
//   },
//   importerName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   importerNBEAccNumber: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   importerTIN: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   importerPhone: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   importedItem: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   hsCode: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   proformaNumber: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   proformaCurrency: {
//     type: DataTypes.ENUM('USD', 'ETB', 'EURO', 'POUND'),
//     allowNull: false,
//   },
//   proformaAmount: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false,
//   },
//   applicationDate: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   registrationDate: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   branchCode: {  // Foreign key for Branch
//     type: DataTypes.STRING,
//     allowNull: false,
//     references: {
//       model: Branch,
//       key: 'branchCode',
//     },
//   },
//   modeOfPayment: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
//   status: {
//     type: DataTypes.STRING,
//   },
//   createdBy: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     references: {
//       model: User,
//       key: 'username',
//     },
//   },
// }, {
//   timestamps: false,
//   hooks: {
//     beforeCreate: async (allocation) => {
//       // Generate queueNumber before creating the entry
//       const lastEntry = await UnauthorizedFcyAllocation.findOne({
//         order: [['queueNumber', 'DESC']],
//       }); 
//       let newQueueNumber;
//       if (!lastEntry) {
//         newQueueNumber = 'GBB0000000001'; // Start from this value
//       } else {
//         const lastQueueNumber = lastEntry.queueNumber;
//         const numberPart = parseInt(lastQueueNumber.replace('GBB', ''), 10);
//         const nextNumberPart = numberPart + 1;
//         newQueueNumber = `GBB${nextNumberPart.toString().padStart(10, '0')}`;
//       }
  
//       console.log("Generated queueNumber:", newQueueNumber); // Debugging log
  
//       allocation.queueNumber = newQueueNumber;  // Set the generated queue number
//       allocation.status="pending"; // Set the status
  
//       console.log("Allocation after setting queueNumber:", allocation); // Debugging log
//     }
//   }
  
// });

// // Association with User model
// UnauthorizedFcyAllocation.associate = function(models) {
//   UnauthorizedFcyAllocation.belongsTo(models.User, { as: 'createdBy', foreignKey: 'username' });
//   UnauthorizedFcyAllocation.belongsTo(models.Branch, { foreignKey: 'branchCode' });
// };

// module.exports = UnauthorizedFcyAllocation;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Branch = require('./branch');
const Currency = require('./currency');

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
  // proformaCurrency: {
  //   type: DataTypes.ENUM('USD', 'ETB', 'EURO', 'POUND'),
  //   allowNull: false,
  // },
  proformaCurrency: {  // Foreign key for Branch
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Currency,
      key: 'currencyCode',
    },
  },
  proformaAmount: {
    type: DataTypes.FLOAT,
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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
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
}, {
  timestamps: false,
  hooks: {
    beforeCreate: async (allocation) => {
      // Generate queueNumber before creating the entry
      const lastEntry = await UnauthorizedFcyAllocation.findOne({
        order: [['queueNumber', 'DESC']],
      }); 
      let newQueueNumber;
      if (!lastEntry) {
        newQueueNumber = 'GBB_0000000001'; // Start from this value
      } else {
        const lastQueueNumber = lastEntry.queueNumber;
        const numberPart = parseInt(lastQueueNumber.replace('GBB_', ''), 10);
        const nextNumberPart = numberPart + 1;
        newQueueNumber = `GBB_${nextNumberPart.toString().padStart(10, '0')}`;
      }
  
      console.log("Generated queueNumber:", newQueueNumber); // Debugging log
  
      allocation.queueNumber = newQueueNumber;  // Set the generated queue number
      allocation.status = "pending"; // Set the initial status
  
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
  // UnauthorizedFcyAllocation.belongsTo(models.User, { as: 'createdBy', foreignKey: 'username' });
  UnauthorizedFcyAllocation.belongsTo(models.Branch, { foreignKey: 'branchCode' });
};

module.exports = UnauthorizedFcyAllocation;
