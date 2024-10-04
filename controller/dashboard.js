const UnauthorizedFcyAllocation = require('../model/FcyInAu');
const AuthorizedFcyAllocation = require('../model/FcyLive');

// Get total number of Unauthorized FCY Allocations
const getUnauthorizedFcyCount = async (req, res) => {
  try {
    const totalUnauthorizedFcyAllocation = await UnauthorizedFcyAllocation.count();
    res.status(200).json({ totalUnauthorizedFcyAllocation });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching unauthorized FCY count' });
  }
};

// Get total number of Authorized FCY Allocations
const getAuthorizedFcyCount = async (req, res) => {
  try {
    const totalAuthorizedFcyAllocation = await AuthorizedFcyAllocation.count();
    res.status(200).json({ totalAuthorizedFcyAllocation });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching authorized FCY count' });
  }
};

const getNumberOfRejectedFcy = async (req, res) => {
  try {
      // Fetch all records with a status of 'rejected' for the specific user
      const rejectedFcy = await FcyInAuModel.findAll({
          where: {
              status: 'rejected' // Assuming 'rejected' is the status value
          }
      });
      if (rejectedFcy.length === 0) {
          return res.status(404).json({ message: 'No rejected records found' });
      }

      // Return the count of rejected records
      return res.status(200).json({ count: rejectedFcy.length, rejectedFcy });
  } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
};
const getNumberOfAuthorizedFcy = async (req, res) => {
  try {
      // Fetch all records with a status of 'rejected' for the specific user
      const rejectedFcy = await FcyInAuModel.findAll({
          where: {
              status: 'authorized' // Assuming 'rejected' is the status value
          }
      });
      if (rejectedFcy.length === 0) {
          return res.status(404).json({ message: 'No rejected records found' });
      }

      // Return the count of rejected records
      return res.status(200).json({ count: rejectedFcy.length, rejectedFcy });
  } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
};
const getApprovedInMonth = async (req, res) => {
  try {
      const { month } = req.body; // Expected format 'YYYY-MM'

      // Split the month and year from the request body
      const [year, monthNumber] = month.split('-');

      // Query all records where approvedAt falls in the same month and year
      const approvedRecords = await FcyInAuModel.findAll({
          where: {
              approvedAt: {
                  [Sequelize.Op.and]: [
                      Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('approvedAt')), year),
                      Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('approvedAt')), monthNumber)
                  ]
              }
          }
      });

      // Check if any records were found
      if (approvedRecords.length === 0) {
          return res.status(404).json({ message: 'No records found for the given month' });
      }

      // Return the found records
      return res.status(200).json({ count: approvedRecords.length, approvedRecords });
  } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports={
    getUnauthorizedFcyCount,
    getAuthorizedFcyCount,
    getNumberOfRejectedFcy,
    getNumberOfAuthorizedFcy,
    getApprovedInMonth,
}
