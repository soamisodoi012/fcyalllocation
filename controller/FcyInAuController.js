const FcyInAuModel = require('../model/FcyInAu');

// const createFcyInAu = async (req, res) => {
//     try {
//         const FcyRegistration = await FcyInAuModel.create(req.body, {
//           validate: false,  // Disable validation here
//         });
    
//         // Now you can validate after queueNumber is generated
//         await FcyRegistration.validate();
//         return res.status(200).json({
//             FcyRegistration,
//         });
//     } catch (error) {
//         console.error('Error creating FcyRegistration:', error);
//         return res.status(500).json({
//             message: 'An error occurred while creating FcyRegistration',
//             error: error.message,
//         });
//     }
// };

const createFcyInAu = async (req, res) => {
  try {
      const immputer = req.user.username;

      // Add immputer to the request body
      const FcyData = {
          ...req.body,
          immputer,  // Include immputer field
      };

      // Create the FcyInAu entry without validation
      const FcyRegistration = await FcyInAuModel.create(FcyData, {
        validate: false,  // Disable validation here
      });
  
      // Now you can validate after queueNumber is generated
      await FcyRegistration.validate();

      return res.status(200).json({
          FcyRegistration,
      });
  } catch (error) {
      console.error('Error creating FcyRegistration:', error);
      return res.status(500).json({
          message: 'An error occurred while creating FcyRegistration',
          error: error.message,
      });
  }
};

const updateUnauthorizedFcyAllocation = async (req, res) => {
  try {
    const updateData = req.body;

    
    const allocation = await FcyInAuModel.findOne({ where: { queueNumber: req.params.pk } });

    if (!allocation) {
      return res.status(404).json({ message: 'Unauthorized FCY Allocation not found' });
    }

    // Update the allocation with new data if necessary
    await allocation.update(updateData);

    res.status(200).json({
      message: 'Unauthorized FCY Allocation updated successfully',
      data: allocation,
    });
  } catch (error) {
    console.error('Error updating Unauthorized FCY Allocation:', error);
    res.status(500).json({ error: 'An error occurred while updating the allocation' });
  }
};


// delete the allocation if neccesary
const deleteFcyInAu = async (req, res) => {
  try {
    const deleData = await FcyInAuModel.destroy({ where: { queueNumber: req.params.pk } });

    if (deleData === 0) {
      return res.status(404).json({ message: 'No record found to delete' });
    }

    return res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while deleting the record' });
  }
};
const getFcyInById=async (req, res) => {
  try { 
    const getbyId=await FcyInAuModel.findOne({ where: { queueNumber: req.params.pk } });
    if (getbyId==0) 
    {
      return res.status(404).json({ message: 'not found'});}
      else
      {

      return res.status(200).json({ data: getbyId})
    }
  }
      catch(error) {return res.status(500).json({ error: error.message})
      };
    }
  
module.exports = {
    createFcyInAu,
    updateUnauthorizedFcyAllocation,
    deleteFcyInAu,
    getFcyInById,
};
