const { status } = require('express/lib/response');
const UnauthorizedFcyAllocation = require('../model/FcyInAu');
const AuthorizedFcyAllocation = require('../model/FcyLive');
const { SELECTED_YEARS,SELECTED_MONTHS } = require('../config/yearConfig');
const { Sequelize } = require('sequelize');
const { months } = require('moment');

// Get total number of Unauthorized FCY Allocations
const countAllApproved = async (req, res) => {
  try {
      // Fetch all records with a status of 'rejected' for the specific user
      const approvedFcy = await AuthorizedFcyAllocation.findAll({
          where: {
              status: 'approved' // Assuming 'rejected' is the status value
          }
      });
      if (approvedFcy.length === 0) {
          return res.status(404).json({ message: 'No approved records found' });
      }

      // Return the count of rejected records
      return res.status(200).json({ count: approvedFcy.length, approvedFcy });
  } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
};


///////////////getNumberOfRejectedFcy

const getNumberOfRejectedFcy = async (req, res) => {
  try {
      // Fetch all records with a status of 'rejected' for the specific user
      const waitingFor_Authorization = await UnauthorizedFcyAllocation.findAll({
          where: {
              status: 'rejected' // Assuming 'rejected' is the status value
          }
      });
      if (waitingFor_Authorization.length === 0) {
          return res.status(404).json({ message: 'No waitingFor_Authorization records found' });
      }

      // Return the count of rejected records
      return res.status(200).json({ count: waitingFor_Authorization.length, waitingFor_Authorization });
  } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
};




const waitingForAuthorizationCount = async (req, res) => {
  try {
      // Fetch all records with a status of 'rejected' for the specific user
      const waitingFor_Authorization = await UnauthorizedFcyAllocation.findAll({
          where: {
              status: 'waiting for authorization' // Assuming 'rejected' is the status value
          }
      });
      if (waitingFor_Authorization.length === 0) {
          return res.status(404).json({ message: 'No waitingFor_Authorization records found' });
      }

      // Return the count of rejected records
      return res.status(200).json({ count: waitingFor_Authorization.length, waitingFor_Authorization });
  } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
};
const getNumberOfAuthorizedFcy = async (req, res) => {
  try {
      // Fetch all records with a status of 'rejected' for the specific user
      const rejectedFcy = await UnauthorizedFcyAllocation.findAll({
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
const getNumberOfPendingFcy = async (req, res) => {
    try {
        // Fetch all records with a status of 'rejected' for the specific user
        const rejectedFcy = await UnauthorizedFcyAllocation.findAll({
            where: {
                status: 'pending' // Assuming 'rejected' is the status value
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
  const getFcyAllocationCounts = async (req, res) => {
    try {
      // Count the number of records for each status
  
      // Total New (e.g., pending status)
      const pending = await UnauthorizedFcyAllocation.count({
        where: { status: 'pending' }
      });
      const authorized = await UnauthorizedFcyAllocation.count({
        where: { status: 'authorized' }
      });
  
      // Waiting for Authorization
      const waitingForAuthorization = await UnauthorizedFcyAllocation.count({
        where: { status: 'waiting for authorization' }
      });
  
      // Total Rejected
      const Rejected = await UnauthorizedFcyAllocation.count({
        where: { status: 'rejected' }
      });
  
      // Waiting for Approval (authorized status)
      const approved = await AuthorizedFcyAllocation.count({
        where: { status: 'approved' }
      });
  
      // Return the results in a single JSON object
      return res.status(200).json({
        pending,
        waitingForAuthorization,
        authorized,
        Rejected,
        approved
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
const consolidated = async (req, res) => {
    const today = new Date();
    const currentMonth = today.getMonth();

    // Prepare the response structure
    const response = {
        day: [],
        week: [],
        month: [],
        year: []
    };

    try {
        // Day data for the last 7 days
        const dayPromises = [];
        for (let i = 6; i >= 0; i--) {
            const registrationDate = new Date(today);
            registrationDate.setDate(today.getDate() - i);
            registrationDate.setHours(0, 0, 0, 0); // Set to midnight

            dayPromises.push(
                Promise.all([
                    UnauthorizedFcyAllocation.findAll({
                        where: {
                            registrationDate: {
                                [Sequelize.Op.gte]: registrationDate,
                                [Sequelize.Op.lt]: new Date(registrationDate.getTime() + 24 * 60 * 60 * 1000)
                            }
                        }
                    }),
                    AuthorizedFcyAllocation.findAll({
                        where: {
                            registrationDate: {
                                [Sequelize.Op.gte]: registrationDate,
                                [Sequelize.Op.lt]: new Date(registrationDate.getTime() + 24 * 60 * 60 * 1000)
                            }
                        }
                    })
                ]).then(([unauthorizedRecords, authorizedRecords]) => {
                    const statusCount = { new: 0, approved: 0, rejected: 0, authorizations: 0 };
                    unauthorizedRecords.forEach(record => {
                        statusCount[record.status]++;
                    });
                    statusCount.approved = authorizedRecords.length;
                    return [registrationDate.toLocaleDateString(), statusCount];
                })
            );
        }
        const dayRecords = await Promise.all(dayPromises);
        response.day = dayRecords;

        // Week data (4 weeks of the current month)
        const weeksInMonth = Math.ceil(new Date(today.getFullYear(), currentMonth + 1, 0).getDate() / 7);
        const weekPromises = [];
        for (let i = 0; i < weeksInMonth; i++) {
            const weekStart = new Date(today.getFullYear(), currentMonth, i * 7 + 1);
            weekStart.setHours(0, 0, 0, 0);

            weekPromises.push(
                Promise.all([
                    UnauthorizedFcyAllocation.findAll({
                        where: {
                            registrationDate: {
                                [Sequelize.Op.gte]: weekStart,
                                [Sequelize.Op.lt]: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7)
                            }
                        }
                    }),
                    AuthorizedFcyAllocation.findAll({
                        where: {
                            registrationDate: {
                                [Sequelize.Op.gte]: weekStart,
                                [Sequelize.Op.lt]: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7)
                            }
                        }
                    })
                ]).then(([unauthorizedRecords, authorizedRecords]) => {
                    const statusCount = { new: 0, approved: 0, rejected: 0, authorizations: 0 };
                    unauthorizedRecords.forEach(record => {
                        statusCount[record.status]++;
                    });
                    statusCount.approved = authorizedRecords.length;
                    return [`Week ${i + 1} ${weekStart.toLocaleString('default', { month: 'long' })}`, statusCount];
                })
            );
        }
        const weekRecords = await Promise.all(weekPromises);
        response.week = weekRecords;

        // Month data for the selected years and months
        const monthPromises = [];
        for (const year of SELECTED_YEARS) {
            for (const month of SELECTED_MONTHS) {
                if (month <= currentMonth) {
                    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

                    monthPromises.push(
                        Promise.all([
                            UnauthorizedFcyAllocation.findAll({
                                where: {
                                    registrationDate: {
                                        [Sequelize.Op.gte]: new Date(year, month, 1),
                                        [Sequelize.Op.lt]: new Date(year, month + 1, 1)
                                    }
                                }
                            }),
                            AuthorizedFcyAllocation.findAll({
                                where: {
                                    registrationDate: {
                                        [Sequelize.Op.gte]: new Date(year, month, 1),
                                        [Sequelize.Op.lt]: new Date(year, month + 1, 1)
                                    }
                                }
                            })
                        ]).then(([unauthorizedRecords, authorizedRecords]) => {
                            const statusCount = { new: 0, approved: 0, rejected: 0, authorizations: 0 };
                            unauthorizedRecords.forEach(record => {
                                statusCount[record.status]++;
                            });
                            statusCount.approved = authorizedRecords.length;
                            return [`${monthName} ${year}`, statusCount];
                        })
                    );
                }
            }
        }
        const monthRecords = await Promise.all(monthPromises);
        response.month = monthRecords;

        // Year data for the selected years
        const yearPromises = [];
        for (const year of SELECTED_YEARS) {
            yearPromises.push(
                Promise.all([
                    UnauthorizedFcyAllocation.findAll({
                        where: {
                            registrationDate: {
                                [Sequelize.Op.gte]: new Date(year, 0, 1),
                                [Sequelize.Op.lt]: new Date(year + 1, 0, 1)
                            }
                        }
                    }),
                    AuthorizedFcyAllocation.findAll({
                        where: {
                            registrationDate: {
                                [Sequelize.Op.gte]: new Date(year, 0, 1),
                                [Sequelize.Op.lt]: new Date(year + 1, 0, 1)
                            }
                        }
                    })
                ]).then(([unauthorizedRecords, authorizedRecords]) => {
                    const statusCount = { new: 0, approved: 0, rejected: 0, authorizations: 0 };
                    unauthorizedRecords.forEach(record => {
                        statusCount[record.status]++;
                    });
                    statusCount.approved = authorizedRecords.length;
                    return [year.toString(), statusCount];
                })
            );
        }
        const yearRecords = await Promise.all(yearPromises);
        response.year = yearRecords;

        // Send the structured response
        res.json(response);
    } catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


module.exports={
  waitingForAuthorizationCount,
  countAllApproved,
  consolidated,
  getNumberOfRejectedFcy,
  getNumberOfPendingFcy,
    getNumberOfAuthorizedFcy,
    getFcyAllocationCounts,
}
