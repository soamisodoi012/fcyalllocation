const createBranch=require('../model/branch')
const createcompany=async (req, res) => {
    try {
        const branch = await createBranch.create(req.body, {
          validate: false,  // Disable validation here
        });
        await branch.validate();
        return res.status(200).json({
            branch,
        });
    } catch (error) {
        console.error('Error creating branch:', error);
        return res.status(500).json({
            message: 'An error occurred while creating branch',
            error: error.message,
        });
    }
};
module.exports=createcompany