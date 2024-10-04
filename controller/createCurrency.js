const currency=require('../model/currency')
const insertCurrency=async (req, res) => {
    try {
        const currencData = await currency.create(req.body, {
          validate: false,  // Disable validation here
        });
        await currencData.validate();
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
module.exports=insertCurrency