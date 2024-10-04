const FcyLiveAllocation = require('../model/FcyLive');
const FcyInAu = require('../model/FcyInAu');

const approveFcy = async (req, res) => {
    try {
        // Fetch the record from FcyInAu using the primary key from the request
        const fcyAuthorize = await FcyInAu.findByPk(req.params.pk);
        if (!fcyAuthorize) {
            return res.status(404).json({ message: 'Record not found' });
        }
        // Create a new record in FcyLiveAllocation based on the fetched data
        const fcyAuthorized = await FcyLiveAllocation.create({
            queueNumber:fcyAuthorize.queueNumber,
            importerName: fcyAuthorize.importerName,
            importerNBEAccNumber: fcyAuthorize.importerNBEAccNumber,
            importerTIN: fcyAuthorize.importerTIN,
            importerPhone: fcyAuthorize.importerPhone,
            importedItem: fcyAuthorize.importedItem,
            hsCode: fcyAuthorize.hsCode,
            proformaNumber: fcyAuthorize.proformaNumber,
            proformaCurrency: fcyAuthorize.proformaCurrency,
            proformaAmount: fcyAuthorize.proformaAmount,
            applicationDate: fcyAuthorize.applicationDate,
            registrationDate: fcyAuthorize.registrationDate,
            branch: fcyAuthorize.branch,
            modeOfPayment: fcyAuthorize.modeOfPayment,
            approvedBy: req.user.username // Assuming you have a logged-in user
        });
// remove from the unautherized tabel
        await FcyInAu.destroy({ where: { queueNumber: req.params.pk } }); // Uncomment if needed

        return res.status(200).json({
            message: 'Record authorized successfully',
            fcyAuthorized,
        });
    } catch (error) {
        console.error('Error approving Fcy:', error);

        return res.status(500).json({
            message: 'An error occurred while approving Fcy',
            error: error.message,
        });
    }
};
const viewById=async(req,res)=> {
    try {
    const viewDataById = await FcyLiveAllocation.findOne({where: { queueNumber: req.params.pk }});
    if (viewDataById){
        return res.status(200).json({ viewDataById,});
        }
        else{
            return res.status(404).json({ message: 'not found'}); 
        }
    }
    catch (error) {
        return res.status(500).json({
        message: 'An error occurred while fetching  data ',
        error: error.message,
    });
    }
};
    //// i will review it deply
// const rejectById=async(req, res)=> {
//     try{
//     const allocation = await FcyInAu.findOne({
//         where: { queueNumber: req.params.pk}
//       });
//       if (allocation) {
//        allocation.status="rejected"
//        await allocation.save();
//       }
//       return res.status(200).json({data:allocation});
// }
// catch (error) {
//     return res.status(500).json({
//         message: 'Error while retrieving allocation data',
//         error: error.message,
//     });
// }
// };
const rejectById = async (req, res) => {
    try {
      const allocation = await UnauthorizedFcyAllocation.findOne({
        where: { queueNumber: req.params.pk },
      });
  
      if (allocation) {
        allocation.status = 'rejected';
  
        // Optionally set rejection reason from the request body if provided
        if (req.body.rejectionReason) {
          allocation.rejectionReason = req.body.rejectionReason;
        }
  
        await allocation.save();
      }
  
      return res.status(200).json({ data: allocation });
    } catch (error) {
      return res.status(500).json({
        message: 'Error while retrieving allocation data',
        error: error.message,
      });
    }
  };  
const auById=async(req, res)=> {
    try{
    const allocation = await FcyInAu.findOne({
        where: { queueNumber: req.params.pk}
      });
      if (allocation) {
       allocation.status="authorized"
       await allocation.save();
      }
      return res.status(200).json({data:allocation});
}
catch (error) {
    return res.status(500).json({
        message: 'Error while retrieving allocation data',
        error: error.message,
    });
}
};
const viewAllocation = async (req, res) => {
    try {
        const viewAllocationData = await FcyLiveAllocation.findAll();
        return res.status(200).json({ data: viewAllocationData });
    } catch (error) {
        return res.status(500).json({
            message: 'Error while retrieving allocation data',
            error: error.message,
        });
    }
};
module.exports = {
    approveFcy,
    viewById,
    rejectById,
    viewAllocation,
    auById,
}



// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail', // Use your email provider
//     auth: {
//         user: 'your-email@gmail.com', // Your email
//         pass: 'your-email-password' // Your email password or app password
//     }
// });

// const rejectById = async (req, res) => {
//     try {
//         const allocation = await FcyInAu.findOne({
//             where: { queueNumber: req.params.pk }
//         });

//         if (!allocation) {
//             return res.status(404).json({
//                 message: 'Allocation not found'
//             });
//         }

//         if (allocation.status === "rejected") {
//             return res.status(400).json({
//                 message: 'This allocation has already been rejected by another user.'
//             });
//         }

//         // Update status to 'rejected'
//         allocation.status = "rejected";
//         await allocation.save();

//         // Send notification email
//         const mailOptions = {
//             from: 'your-email@gmail.com',
//             to: 'user-email@example.com', // Replace with the user's email
//             subject: 'Allocation Status Updated',
//             text: `The allocation with queue number ${req.params.pk} has been rejected.`
//         };

//         await transporter.sendMail(mailOptions);

//         return res.status(200).json({ data: allocation });
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Error while rejecting the allocation',
//             error: error.message,
//         });
//     }
// };



// models/Notification.js
// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/database'); // Adjust according to your setup

// class Notification extends Model {}

// Notification.init({
//     userId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     message: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     viewed: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//     },
// }, {
//     sequelize,
//     modelName: 'Notification',
// });

// module.exports = Notification;






// const getUnviewedNotifications = async (req, res) => {
//     try {
//         // Fetch unviewed notifications
//         const notifications = await Notification.findAll({
//             where: { viewed: false },
//             order: [['createdAt', 'DESC']], // Optional: order by creation date
//         });

//         // Count the unviewed notifications
//         const count = notifications.length;

//         // Update notifications to marked as viewed
//         if (count > 0) {
//             await Notification.update(
//                 { viewed: true },
//                 { where: { id: notifications.map(notification => notification.id) } }
//             );
//         }

//         // Return both the count and the notifications
//         return res.status(200).json({ count, notifications });
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Error while fetching notifications',
//             error: error.message,
//         });
//     }
// };