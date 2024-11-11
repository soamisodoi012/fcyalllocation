const FcyInAu = require('../model/FcyInAu');

 const Notification = require('../model/Notification');
const getAllFcyInAu = async (req, res) => {
    try {
      const fcy = await FcyInAu.findAll();
      res.status(200).json(fcy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
const getFcyInAuByIdWithRejectionHistory = async (req, res) => {
    try {
      // Fetch the record by primary key
      const fcy = await FcyInAu.findByPk(req.params.pk);
  
      if (!fcy) {
        return res.status(404).json({ error: "Record not found" });
      }
  
      // Check if status is rejected
      if (fcy.status === "rejected") {
        // Find the rejection reason and remark from the notification table using queueNumber as the foreign key
        const notification = await Notification.findOne({
          where: { queueNumber: req.params.pk },
          attributes: ['rejectionReason', 'remark'],
        });
  
        if (notification) {
          return res.status(200).json({
            ...fcy.toJSON(),
            rejectionReason: notification.rejectionReason,
            remark: notification.remark,
          });
        }
      }
  
      // If not rejected, return the original record
      res.status(200).json(fcy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };  
  module.exports ={ 
    getAllFcyInAu,
    getFcyInAuByIdWithRejectionHistory,
}
// const { FcyInAu, Notification } = require('../models'); // Ensure both models are imported

// const getFcyInAuById = async (req, res) => {
//   try {
//     const fcy = await FcyInAu.findByPk(req.params.pk, {
//       include: {
//         model: Notification,
//         attributes: ['rejectionReason'],  // Include rejection reason from Notification
//         required: false,  // Join will only occur if Notification exists
//       },
//     });

//     if (!fcy) {
//       return res.status(404).json({ message: 'FcyInAu entry not found' });
//     }

//     // Check if FcyInAu entry is rejected and include rejectionReason in the response
//     const response = {
//       ...fcy.toJSON(),
//       rejectionReason: fcy.Notification ? fcy.Notification.rejectionReason : null,
//     };

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error('Error fetching FcyInAu entry:', error);
//     return res.status(400).json({ error: error.message });
//   }
// };
