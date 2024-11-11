const Notification = require('../model/Notification.js');
const getNotification = async (req, res) => {
  try {
    // Extract immputer from the request body
    const { immputer } = req.body;

    if (!immputer) {
      return res.status(400).json({ error: 'immputer is required' });
    }

    // Fetch records where the immputer matches the provided value
    const rejectedRecords = await Notification.findAll({
      attributes: ['queueNumber', 'rejectionReason'],  // Fields to select
      where: {
        immputer // Use immputer from the request body
      }
    });

    // Count the number of records
    const count = rejectedRecords.length;

    // Send response with count and records
    res.json({
      count,
     rejectedRecords
    });
    
  } catch (error) {
    console.error('Error fetching rejected records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNotification,
};
