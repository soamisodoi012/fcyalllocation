////const req = require('express/lib/request');
const createBranch=require('../model/branch.js')
const inserb=async (req, res) => {
    try {
        data=req.body
        console.log(data)
        const branchData = await createBranch.create(data, {
         ///// validate: false,  // Disable validation here
        });
        //await currencyData.validate();
        return res.status(200).json({
            branchData,
        });
        
    } catch (error) {
        console.error('Error creating branch:', error);
        return res.status(500).json({
            message: 'An error occurred while creating branch',
            error: error.message,
        });
    }
};
const selectBranch = async (req, res) => {
    try {
        const branchData = await createBranch.findOne({
            where: { branchCode: req.params.pk }
        });

        if (branchData) {
            // Return the branchName and branchCode if the branch is found
            return res.status(200).json({
                branchName: branchData.branchName,
            });
        } else {
            // Branch not found
            return res.status(404).json({ message: 'Branch not found by branchName' });
        }
    } catch (error) {
        // Log the error and respond with status 500
        console.error('Error while retrieving branch data:', error);

        return res.status(500).json({
            message: 'Error while retrieving branch data',
            error: error.message,
        });
    }
};
const getAllBranch=async (req,res)=>{
    
        try {
          const fcy = await createBranch.findAll();
          res.status(200).json(fcy);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      };

module.exports={
    inserb,
    selectBranch,
    getAllBranch,
}
