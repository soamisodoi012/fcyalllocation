const FcyInAuModel = require('../model/FcyInAu');
//const Currency = require('../model/currency');
const Branch = require('../model/branch');
const Item = require('../model/ItemDetail');
///const { UnauthorizedFcyAllocation, Item } = require('../models');  // Ensure UnauthorizedFcyAllocation and Item are imported

// const createFcyInAu = async (req, res) => {
//   try {
//     const { categoryId, proformaNumber,branch,proformaCurrency, item, ...otherData } = req.body; // Destructure itemCode from the request body

//     // Check if categoryId is defined
//     if (!categoryId) {
//       return res.status(400).json({ message: 'Category is required' });
//     }

//     // Handle case where categoryId is 'other'
//     let selectedItem;
//     if (categoryId === 'other') {
//       // Directly use itemCode from request body
//       if (!item) {
//         return res.status(400).json({ message: 'Item code is required when category is other' });
//       }
//       selectedItem = { id: item }; // Create a mock selectedItem
//     } else {
//       // Retrieve items by category
//       const items = await getItemsByCategory(categoryId);
      
//       if (!items || !items.length) {
//         return res.status(404).json({ message: 'No items found for the selected category' });
//       }
      
//       selectedItem = items[0]; // Select the first item
//     }

//     if (!proformaNumber) {
//       return res.status(400).json({ message: 'Proforma number is required' });
//     }

//     // Check if a record with the given proformaNumber already exists
//     const existingProformaNum = await getProformaNumber(proformaNumber);
//     if (existingProformaNum.length > 0) {
//       return res.status(400).json({ message: 'A record with this Proforma Number already exists' });
//     }
//     const branchExists = await Branch.findOne({ where: { branchCode: branch } });
//     if (!branchExists) {
//       return res.status(404).json({ message: 'Branch code not found' });
//     }

//     // Check if proformaCurrency exists in Currency table
//     const currencyExists = await Currency.findOne({ where: { currencyCode: proformaCurrency } });
//     if (!currencyExists) {
//       return res.status(404).json({ message: 'Proforma currency not found' });
//     }
//     const FcyData = {
//       ...otherData,
//       proformaNumber,
//       branch,
//       proformaCurrency,
//       item: selectedItem.itemName,  // Set itemCode to selected item’s ID
//     };

//     // Create the UnauthorizedFcyAllocation entry without validation
//     const FcyRegistration = await FcyInAuModel.create(FcyData, {
//       validate: false,
//     });

//     // Perform post-creation validation
//     await FcyRegistration.validate();

//     return res.status(200).json({
//       FcyRegistration,
//     });
//   } catch (error) {
//     console.error('Error creating FcyRegistration:', error);
//     return res.status(500).json({
//       message: 'An error occurred while creating FcyRegistration',
//       error: error.message,
//     });
//   }
// };

// // Function to fetch items by category
// const getItemsByCategory = async (categoryId) => {
//   console.log("Fetching items by category ID:", categoryId);
//   return await Item.findAll({ where: { categoryId } });
// };

// // Function to check if proformaNumber already exists
// const getProformaNumber = async (proformaNumber) => {
//   return await FcyInAuModel.findAll({ where: { proformaNumber } });
// };
const createFcyInAu = async (req, res) => {
  try {
    const { category, proformaNumber, branch, item, ...otherData } = req.body;

    // Check if categoryId is defined
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Handle case where categoryId is 'other'
    let selectedItem;
    if (category === 'other') {
      if (!item) {
        return res.status(400).json({ message: 'Item code is required when category is other' });
      }
      selectedItem = { id: item }; // Create a mock selectedItem
    } else {
      const items = await getItemsByCategory(category);
      if (!items || !items.length) {
        return res.status(404).json({ message: 'No items found for the selected category' });
      }
      selectedItem = items[0]; // Select the first item
    }

    // Validate proformaNumber
    if (!proformaNumber) {
      return res.status(400).json({ message: 'Proforma number is required' });
    }

    const existingProformaNum = await getProformaNumber(proformaNumber);
    if (existingProformaNum.length > 0) {
      return res.status(400).json({ message: 'A record with this Proforma Number already exists' });
    }

    const branchExists = await Branch.findOne({ where: { branchCode: branch } });
    if (!branchExists) {
      return res.status(404).json({ message: 'Branch code not found' });
    }
    const FcyData = {
      ...otherData,
      proformaNumber,
      branch,
      category,
      item: selectedItem.itemName,
      };

    const FcyRegistration = await FcyInAuModel.create(FcyData, { validate: false });
    await FcyRegistration.validate();

    return res.status(200).json({
      FcyRegistration, // Return available currency IDs
    });
  } catch (error) {
    console.error('Error creating FcyRegistration:', error);
    return res.status(500).json({
      message: 'An error occurred while creating FcyRegistration',
      error: error.message,
    });
  }
};

// Function to fetch currency data from an external source (API or database)
const fetchCurrencyData = async (req, res) => {
  // Simulated response for demonstration; replace with actual API call
  return res.status(200).json([
    { market: "10", sellRate: "14.2290", displayName: "United Arab Emirates Dirhams", currencyId: "AED", buyRate: "13.9500" },
    { market: "1", sellRate: "121.7462", displayName: "US Dollar", currencyId: "usd", buyRate: "105.6139" },
    { market: "10", sellRate: "0.4000", displayName: "Kuwait Dinars", currencyId: "KWD", buyRate: "0.3000" },
    // Other currencies...
  ]);
};
// Function to fetch items by category
const getItemsByCategory = async (categoryId) => {
  console.log("Fetching items by category ID:", categoryId);
  return await Item.findAll({ where: { categoryId } });
};

// Function to check if proformaNumber already exists
const getProformaNumber = async (proformaNumber) => {
  return await FcyInAuModel.findAll({ where: { proformaNumber } });
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
    const getINUByPhone=async (req, res) => {
      try
      { const {importerPhone}=req.body;
       const allocationData = await FcyInAuModel.findAll({where: {importerPhone:importerPhone},});
       if(!allocationData){
         return res.status(404).json({ message: 'Allocation not found' });
       }
       return res.status(200).json({ allocationData });
     }
     catch (error) {
       return res.status(500).json({
         message: 'Error while retrieving allocation data',
         error: error.message,
       });
     }}
 const getByQueueDate=async (req, res) => {
       try
       { const {queueDate}=req.body;
        const allocationData = await FcyInAuModel.findAll({where: {queueDate:queueDate},});
        if(!allocationData){
          return res.status(404).json({ message: 'Allocation not found' });
        }
        return res.status(200).json({ allocationData });
      }
      catch (error) {
        return res.status(500).json({
          message: 'Error while retrieving allocation data',
          error: error.message,
        });
      }}
const rejectById = async (req, res) => {
        try {
          const allocation = await FcyInAu.findOne({
            where: { queueNumber: req.params.pk },
          });
           if (allocation.status ==='rejected') {
           return res.status(400).json({ message: 'Allocation is already rejected' });} else {
          if (allocation && allocation.status !== 'rejected') {
            allocation.status = 'rejected';
      
            // Optionally set rejection reason from the request body if provided
            let rejectionReason = req.body.rejectionReason || 'No reason provided';
            allocation.rejectionReason = rejectionReason;
      
            await allocation.save();
      
            // Create a notification record after rejecting the allocation
            await Notification.create({
              queueNumber: allocation.queueNumber,
              rejectedby: allocation.immputer,//req.user.username, // assuming req.user contains user data
              imputer: allocation.immputer,   // same as rejectedby unless you have a separate field for this
              rejectionReason: rejectionReason,
            });
          }
      
          return res.status(200).json({message:"sucess" });
        } }catch (error) {
          return res.status(500).json({
            message: 'Error while processing allocation rejection',
            error: error.message,
          });
        }
      };
        
const auById=async(req, res)=> {
          try{
          const allocation = await FcyInAu.findOne({
              where: { queueNumber: req.params.pk}
            });
            if (!allocation) {
              return res.status(404).json({ message: 'Allocation not found' });
            }
            if (allocation.status ==='authorized') {
              return res.status(400).json({ message: 'Allocation is already authorized' });}else {
            if (allocation && allocation.status !=='authorized') {
             allocation.status="authorized"
             await allocation.save();
            }
            await Notification.destroy({where: {queueNumber: allocation.queueNumber}});
            return res.status(200).json({data:allocation});
      }}
      catch (error) {
          return res.status(500).json({
              message: 'Error while retrieving allocation data',
              error: error.message,
          });
      }
      };
const waitingForAuthorization = async (req, res) => {
        try {
          const allocation = await FcyInAu.findOne({
            where: { queueNumber: req.params.pk },
          });
      if (!allocation) 
        return res.status(404).json({ message: 'Allocation not found' });
      if (allocation.status === 'waiting For Authorization') {
        return res.status(400).json({ message: 'Allocation is already waiting for authorization' });
      } 
            allocation.status = 'waiting For Authorization';
          await allocation.save();
          await Notification.destroy({where: {queueNumber: allocation.queueNumber}});
          return res.status(200).json({ data: allocation });
        } catch (error) {
          return res.status(500).json({
            message: 'Error while retrieving allocation data',
            error: error.message,
          });
        }
      };
module.exports = {
    createFcyInAu,
    fetchCurrencyData,
    updateUnauthorizedFcyAllocation,
    deleteFcyInAu,
    getFcyInById,
    rejectById,
    getINUByPhone,
    auById,
    getByQueueDate,
    waitingForAuthorization,
};
// const createFcyInAu = async (req, res) => {
//   try {
//     const { categoryId, proformaNumber, ...otherData } = req.body; // Destructure categoryId and other fields from the request body

//     // Check if categoryId is defined
//     if (!categoryId) {
//       return res.status(400).json({ message: 'Category is required' });
//     }

//     // Retrieve items by category
//     const items = await getItemsByCategory(categoryId);
    
//     if (!items || !items.length) {
//       return res.status(404).json({ message: 'No items found for the selected category' });
//     }
//     if (!proformaNumber) {
//       return res.status(400).json({ message: 'Category is required' });
//     }
//     // Check if a record with the given proformaNumber already exists
//     const existingProformaNum = await getProformaNumber(proformaNumber);
//     if (existingProformaNum.length > 0) {
//       return res.status(400).json({ message: 'A record with this Proforma Number already exists' });
//     }

//     // Select the first item or modify selection logic as needed
//     const selectedItem = items[0];
//     const FcyData = {
//       ...otherData,
//       proformaNumber,
//       itemCode: selectedItem.id,  // Set itemCode to selected item’s ID
//     };

//     // Create the UnauthorizedFcyAllocation entry without validation
//     const FcyRegistration = await FcyInAuModel.create(FcyData, {
//       validate: false,
//     });

//     // Perform post-creation validation
//     await FcyRegistration.validate();

//     return res.status(200).json({
//       FcyRegistration,
//     });
//   } catch (error) {
//     console.error('Error creating FcyRegistration:', error);
//     return res.status(500).json({
//       message: 'An error occurred while creating FcyRegistration',
//       error: error.message,
//     });
//   }
// };

// // Function to fetch items by category
// const getItemsByCategory = async (categoryId) => {
//   console.log("Fetching items by category ID:", categoryId); // Changed to use categoryId
//   return await Item.findAll({ where: { categoryId } });
// };

// // Function to check if proformaNumber already exists
// const getProformaNumber = async (proformaNumber) => {
//   return await FcyInAuModel.findAll({ where: { proformaNumber } });
// };